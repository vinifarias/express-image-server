import path from 'path'

import { NextFunction, Request, Response } from 'express'

import { generateFileName, normalizeQuery } from '../helpers'
import { ImageTransformer } from '../image-transformer'
import { QueryParams, Storage } from '../types'

interface OptionsType {
  storage: Storage
  config: Record<string, string>
}

export function processMiddleware(options: OptionsType) {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const queryParams: QueryParams = req.query as unknown as QueryParams
      const imgName = req.params.id

      const normalizedQuery = normalizeQuery(queryParams)
      const newImgName = generateFileName(imgName, normalizedQuery)
      const newImgFormat = path.extname(newImgName).split('.')[1]

      const storage = options.storage

      // Check if the processed image already exist in storage
      if (await storage.exists(newImgName)) {
        const image = await storage.fetch(newImgName)

        if (!image) return errorResponse(res, 'Error fetching processed image.')

        return successResponse(res, image, newImgFormat)
      }

      // Get the image from storage
      const image = await storage.fetch(imgName)

      if (!image) {
        return errorResponse(res, 'Image not found.')
      }

      // Process the image
      const transformedImage = await new ImageTransformer().transform(
        image,
        normalizedQuery,
      )

      // Save the image
      storage.save(newImgName, transformedImage)

      return successResponse(res, transformedImage, newImgFormat)
    } catch (err) {
      next(err)
    } finally {
      next()
    }
  }
}

function successResponse(res: Response, file: Buffer, format: string) {
  res.set('Content-Type', `image/${format}`)
  return res.status(200).send(file)
}

function errorResponse(res: Response, message: string) {
  return res.status(500).json({ error: message })
}
