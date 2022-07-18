import path from 'path'

import { NextFunction, Request, Response } from 'express'

import { generateFileName, normalizeQuery } from './helpers'
import { ImageTransformer } from './image-transformer'
import { Storage } from './storage'

interface QueryParams {
  height: number
  width: number
}
interface OptionsType {
  storage: Storage
  config: Record<string, string>
}

export function queryImageMiddleware(options: OptionsType) {
  return async function imageMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const queryParams: QueryParams = req.query as unknown as QueryParams

      const imageName = req.params.id

      const normalizedQuery = normalizeQuery(queryParams)
      const newImageName = generateFileName(imageName, normalizedQuery)

      const imageTransformer = new ImageTransformer()
      const storage = options.storage

      const imgFormat = path.extname(newImageName).split('.')[1]
      res.set('Content-Type', `image/${imgFormat}`)

      // Check if the processed image already exist in storage
      if (await storage.exists(newImageName)) {
        console.log('IMAGE EXISTS...')
        const image = await storage.fetch(newImageName)
        return res.status(200).send(image)
      }

      // Get the image from storage
      const image = await storage.fetch(imageName)

      if (!image) {
        return res.status(500).json({ error: 'Image not found!' })
      }

      // Process the image
      const transformedImage = image
        ? await imageTransformer.transform(image, normalizedQuery)
        : Buffer.from('test')

      // Save the image
      // Do it really need the 'await'? Or can be asynchronous?
      await storage.save(newImageName, transformedImage)

      return res.status(200).send(transformedImage)
    } catch (err) {
      return next(err)
    } finally {
      return next()
    }
  }
}
