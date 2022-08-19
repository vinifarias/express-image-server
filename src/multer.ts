import { Options } from 'multer'

import { FormatEnum, Storage } from './types'

export function multerConfig(storage: Storage): Options {
  if (typeof storage.getMulterStorage !== 'function') {
    throw new Error(
      "Method 'multerConfig' does not exist in the storage class used",
    )
  }

  return {
    storage: storage.getMulterStorage(),
    fileFilter: (req, file, cb) => {
      const fileFormat = file.mimetype.split('/')[1]
      if (fileFormat in FormatEnum) {
        cb(null, true)
      } else {
        cb(new Error('Invalid file type.'))
      }
    },
  }
}
