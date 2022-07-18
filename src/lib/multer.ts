import { Storage } from './storage'

const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024

function multerConfig(storage: Storage) {
  if (typeof storage.multerConfig !== 'function') {
    throw new Error(
      "Method 'multerConfig' does not exist in the storage used",
    )
  }

  return {
    storage: storage.multerConfig(),
    /*fileFilter: (req, file, cb) => {
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
    },*/
  }
}

export { multerConfig }
