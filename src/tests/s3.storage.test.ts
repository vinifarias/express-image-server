import fs from 'fs'
import path from 'path'

import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'
import { mockLibStorageUpload } from 'aws-sdk-client-mock/libStorage'
import multerS3 from 'multer-s3'

import { S3Storage } from '../storages'

const s3ClientMock = mockClient(S3Client)
mockLibStorageUpload(s3ClientMock)
jest.mock('multer-s3')

const mockOptions = {
  accessKeyId: 'mocked-access-key',
  bucketName: 'mocked-bucket-name',
  secretAccessKey: 'mocked-secret-access-key',
  region: 'mocked-region',
}
const IMAGE_NAME = 'image.jpg'

const s3Storage = new S3Storage(mockOptions)

describe('S3Storage tests', () => {
  beforeEach(() => {
    s3ClientMock.reset()
  })

  it('Should save image', async () => {
    const buffer = Buffer.from('')
    await s3Storage.save(IMAGE_NAME, buffer)

    expect(s3ClientMock).toHaveReceivedNthCommandWith(1, PutObjectCommand, {
      Key: IMAGE_NAME,
      Bucket: mockOptions.bucketName,
      Body: buffer,
    })
  })

  it('Should fetch image', async () => {
    s3ClientMock.on(GetObjectCommand).resolves({
      Body: fs.createReadStream(path.resolve(__dirname, 'images/', IMAGE_NAME)),
    })

    await s3Storage.fetch(IMAGE_NAME)

    expect(s3ClientMock).toHaveReceivedNthCommandWith(1, GetObjectCommand, {
      Key: IMAGE_NAME,
      Bucket: mockOptions.bucketName,
    })
  })

  it('Should check if image exists', async () => {
    s3ClientMock.on(HeadObjectCommand).resolves({})

    await s3Storage.exists(IMAGE_NAME)

    expect(s3ClientMock).toHaveReceivedNthCommandWith(1, HeadObjectCommand, {
      Key: IMAGE_NAME,
      Bucket: mockOptions.bucketName,
    })
  })

  it('Should create a multer.S3Storage', () => {
    s3Storage.getMulterStorage()

    expect(multerS3).toBeCalledTimes(1)
  })
})
