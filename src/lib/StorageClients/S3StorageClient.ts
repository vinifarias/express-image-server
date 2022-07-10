import aws from 'aws-sdk'
import multerS3 from 'multer-s3'

import StorageClient from './StorageClient'

// TODO
class S3StorageClient implements StorageClient {
  async saveImage(image: string): Promise<boolean> {
    return true
  }

  async getImage(id: string): Promise<Buffer> {
    return Buffer.from('Testing')
  }

  async imageExists(id: string): Promise<boolean> {
    return true
  }
}

export default S3StorageClient
