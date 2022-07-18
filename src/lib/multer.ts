import path from 'path'

import { StorageClient } from './storage'

const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024

function multerConfig(storageClient: StorageClient) {
  if (typeof storageClient.multerConfig !== 'function') {
    throw new Error(
      "Method 'multerConfig' does not exist in the storage client used",
    )
  }

  return {
    storage: storageClient.multerConfig?.(),
    fileFilter: (req, file, cb) => {
      const allowedMimes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/gif',
      ]

      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(new Error('Invalid file type.'))
      }
    },
  }
}

export { multerConfig }
