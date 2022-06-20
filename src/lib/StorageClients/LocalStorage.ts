import path from "path"
import StorageClient from "./StorageClient"
import fs from "fs"

interface ConfigType {
  destination: string
}

class StorageClientLocal implements StorageClient {
  private destination: string = ''

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

  async getImage(imageName: string): Promise<Buffer> {
    //const file = await fsPromises.readFile(image, { encoding: 'utf8' })
    //const metadata = await sharp(file).metadata()
    const imagePath = path.resolve(this.destination, imageName)
    return fs.readFileSync(imagePath)
  }
}

export default StorageClientLocal