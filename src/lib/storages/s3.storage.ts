import { Readable } from 'node:stream'

import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { StorageEngine } from 'multer'
import multerS3 from 'multer-s3'

import { S3StorageOptions, Storage } from '../types'

class S3Storage implements Storage {
  private bucketName: string
  private s3Client: S3Client

  constructor(options: S3StorageOptions) {
    this.bucketName = options.bucketName
    this.s3Client = new S3Client({
      // apiVersion: '2006-03-01',
      // region: 'us-west-2',
      region: options.region,
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
      }

      const upload = new Upload({
        client: this.s3Client,
        params: params,
      })

      await upload.done()
      return true
    } catch (err) {
      return false
    }
  }

  async fetch(id: string): Promise<Buffer | undefined> {
    try {
      const params = {
        Key: id,
        Bucket: this.bucketName,
      }

      const response = await this.s3Client.send(new GetObjectCommand(params))

      const stream = response.Body as Readable

      return new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = []
        stream.on('data', (chunk) => chunks.push(chunk))
        stream.once('end', () => resolve(Buffer.concat(chunks)))
        stream.once('error', reject)
      })
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
          return false
        },
      )

    return response
  }

  getMulterStorage(): StorageEngine {
    return multerS3({
      s3: this.s3Client,
      bucket: this.bucketName,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: async (req, file, cb) => {
        cb(null, file.originalname)
      },
    })
  }
}
export { S3Storage }
