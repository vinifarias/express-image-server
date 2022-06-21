import StorageClient from './StorageClient'

import multerS3 from 'multer-s3'
import aws from 'aws-sdk'

// TODO
class StorageClientS3 implements StorageClient {
  async saveImage(image: string): Promise<string> {
    return ''
  }

  async getImage(id: string): Promise<Buffer> {
    return Buffer.from('Testing')
  }

  async imageExists(id: string): Promise<boolean> {
    return true
  }
}

export default StorageClientS3
