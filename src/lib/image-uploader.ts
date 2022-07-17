import fs from 'fs'
import path from 'path'

import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024

const multerConfig = {
  dest: path.resolve(__dirname, '/uploads'),
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      //Verifica se não existe o diretório
      if (!fs.existsSync(path.basename('upload'))) {
        //Efetua a criação do diretório caso ele não exista
        fs.mkdirSync(path.basename('upload'))
      }
      //Define o caminho da pasta
      cb(null, path.basename('upload'))
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    },
  }),
  limits: {
    fileSize: MAX_SIZE_TWO_MEGABYTES,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
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

export function postMiddleware() {
  const _func = async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      return res.json({
        response: req.file,
      })
    }
    console.log(req.file)

    res.status(409)

    return res.json({
      response: `Não é um tipo de arquivo válido`,
    })
  }
  return [multer(multerConfig).single('file'), _func]
}
