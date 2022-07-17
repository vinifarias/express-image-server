import fs from 'fs'
import path from 'path'

import { StorageClient } from './StorageClient'

interface LocalStorageOptions {
  dest: string
}

class LocalStorageClient implements StorageClient {
  private dest = ''

  constructor(options: LocalStorageOptions) {
    this.dest = options.dest
  }

  async save(id: string, image: Buffer): Promise<boolean> {
    try {
      const imagePath = path.resolve(this.dest, id)
      await fs.promises.writeFile(imagePath, image)
      return true
    } catch (err) {
      throw new Error(`An error occurred during saving the image: ${err}`)
    }
  }

  async fetch(id: string): Promise<Buffer | undefined> {
    try {
      const imagePath = path.resolve(this.dest, id)
      return fs.promises.readFile(imagePath)
    } catch (err) {
      throw new Error(`An error occurred during getting the image: ${err}`)
    }
  }

  async exists(id: string): Promise<boolean> {
    const imagePath = path.resolve(this.dest, id)
    return await fs.promises.stat(imagePath).then(
      () => true,
      () => false,
    )
  }
}

export { LocalStorageClient }
