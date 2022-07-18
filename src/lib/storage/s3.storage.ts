import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import multerS3 from 'multer-s3'

import { extractOptions, generateFileName } from '../helpers'
import { StorageClient } from './storage'

interface S3StorageOptions {
  bucketName: string
  accessKeyId: string
  secretAccessKey: string
}

class S3StorageClient implements StorageClient {
  private bucketName: string
  private s3Client: S3Client

  constructor(options: S3StorageOptions) {
    this.bucketName = options.bucketName
    this.s3Client = new S3Client({
      // apiVersion: '2006-03-01',
      // region: 'us-west-2',
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      },
    })
  }

  async save(id: string, image: Buffer): Promise<boolean> {
    try {
      const params = {
        Key: id,
        Bucket: this.bucketName,
        Body: image,
        /*ACL: opts.acl,
        CacheControl: opts.cacheControl,
        ContentType: opts.contentType,
        Metadata: opts.metadata,
        StorageClass: opts.storageClass,
        ServerSideEncryption: opts.serverSideEncryption,
        SSEKMSKeyId: opts.sseKmsKeyId,*/
      }

      const upload = new Upload({
        client: this.s3Client,
        params: params,
      })

      upload.on('httpUploadProgress', (progress) => {
        console.log(progress)
      })

      await upload.done()
    } catch (err) {
      console.log(err)
    }

    return false
  }

  async fetch(id: string): Promise<Buffer | undefined> {
    try {
      const params = {
        Key: id,
        Bucket: this.bucketName,
      }

      const response = await this.s3Client.send(new GetObjectCommand(params))

      const stream = response.Body

      if (!Buffer.isBuffer(stream)) {
        return undefined
      }

      return stream
    } catch (err) {
      return undefined
    }
  }

  async exists(id: string): Promise<boolean> {
    const params = {
      Key: id,
      Bucket: this.bucketName,
    }

    const response = await this.s3Client
      .send(new HeadObjectCommand(params))
      .then(
        () => true,
        (err) => {
          if (err.code === 'NotFound') {
            return false
          }
          throw err
        },
      )

    return response
  }

  multerConfig() {
    return multerS3({
      s3: this.s3Client,
      bucket: this.bucketName,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: async (req, file, cb) => {
        const imageOptions = await extractOptions(file.buffer)
        const filename = await generateFileName(file.originalname, imageOptions)
        cb(null, filename)
      },
    })
  }
}
export { S3StorageClient }
