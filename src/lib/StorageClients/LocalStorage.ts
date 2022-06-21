import path from 'path'
import StorageClient from './StorageClient'
import fs from 'fs'

interface ConfigType {
  destination: string
}

class StorageClientLocal implements StorageClient {
  private destination = ''

  constructor(config: ConfigType) {
    this.destination = config.destination
  }

  async saveImage(imageName: string, image: Buffer): Promise<string> {
    const imagePath = path.resolve(this.destination, imageName)
    fs.writeFile(imagePath, image, function (err) {
      if (err) return console.log(err)
      console.log('Image saved')
    })
    return ''
  }

  async getImage(id: string): Promise<Buffer> {
    const imagePath = path.resolve(this.destination, id)
    return fs.promises.readFile(imagePath)
  }

  async imageExists(id: string): Promise<boolean> {
    const imagePath = path.resolve(this.destination, id)
    return fs.promises.stat(imagePath).then(
      () => true,
      () => false,
    )
  }
}

export default StorageClientLocal
