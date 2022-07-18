import { NextFunction, Request, Response } from 'express'
import multer from 'multer'

import { multerConfig } from './multer'

import { Storage } from './storage'
interface OptionsType {
  storage: Storage
  config: Record<string, string>
}

export function postMiddleware(options: OptionsType) {
  const _func = async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      return res.status(200).json({
        response: req.file,
      })
    }
    console.log(req.file)

    res.status(409)

    return res.json({
      response: 'Invalid file format',
    })
  }
  return [multer(multerConfig(options.storage)).single('file'), _func]
}
