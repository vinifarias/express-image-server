import { StorageEngine } from 'multer'

interface Storage {
  save: (id: string, image: Buffer) => Promise<boolean>
  fetch: (id: string) => Promise<Buffer | undefined>
  exists: (id: string) => Promise<boolean>
  multerConfig?: () => StorageEngine
}

export { Storage }
