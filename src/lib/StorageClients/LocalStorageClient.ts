import fs from 'fs'
import path from 'path'

import StorageClient from './StorageClient'

interface ConfigType {
  destination: string
}

class LocalStorageClient implements StorageClient {
  private destination = ''

  constructor(config: ConfigType) {
    this.destination = config.destination
  }

  async saveImage(imgName: string, image: Buffer): Promise<boolean> {
    try {
      const imagePath = path.resolve(this.destination, imgName)
      await fs.promises.writeFile(imagePath, image)
      return true
    } catch (err) {
      throw new Error(`An error occurred during saving the image: ${err}`)
    }
  }

  async getImage(imgName: string): Promise<Buffer> {
    try {
      const imagePath = path.resolve(this.destination, imgName)
      return fs.promises.readFile(imagePath)
    } catch (err) {
      throw new Error(`An error occurred during getting the image: ${err}`)
    }
  }

  async imageExists(imgName: string): Promise<boolean> {
    const imagePath = path.resolve(this.destination, imgName)
    return await fs.promises.stat(imagePath).then(
      () => true,
      () => false,
    )
  }
}

export default LocalStorageClient
