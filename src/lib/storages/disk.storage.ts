import fs from 'fs'
import path from 'path'

import multer, { StorageEngine } from 'multer'

import { DiskStorageOptions, Storage } from '../types'

class DiskStorage implements Storage {
  private dest = ''

  constructor(options: DiskStorageOptions) {
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

  getMulterStorage(): StorageEngine {
    return multer.diskStorage({
      destination: path.resolve(this.dest),
      filename: async (req, file, cb) => {
        cb(null, file.originalname)
      },
    })
  }
}

export { DiskStorage }
