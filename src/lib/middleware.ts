import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { generateNewImgName, normalizeQuery } from './helpers'

import ImageTransformer from './ImageTransformer'
import StorageClient from './StorageClients/StorageClient'

interface QueryParams {
  height: number
  width: number
}
interface optsType {
  storageClient: StorageClient
  config: Record<string, string>
}

export function queryImageMiddleware(opts: optsType) {
  return async function imageMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParams: QueryParams = req.query as unknown as QueryParams

      const imageName = req.params.id

      const normalizedQuery = normalizeQuery(queryParams)
      const newImageName = generateNewImgName(imageName, normalizedQuery)

      const imageTransformer = new ImageTransformer()
      const storageClient = opts.storageClient

      const imgFormat = path.extname(newImageName).split('.')[1]
      res.set('Content-Type', `image/${imgFormat}`)

      // Check if the processed image already exist in storage
      if (await storageClient.imageExists(newImageName)) {
        console.log('IMAGE EXISTS...')
        const image = await storageClient.getImage(newImageName)
        return res.status(200).send(image)
      }

      // Get the image from storage
      const image = await storageClient.getImage(imageName)

      // Process the image
      const transformedImage = await imageTransformer.transform(image, normalizedQuery)

      // Save the image
      await storageClient.saveImage(newImageName, transformedImage)

      return res.status(200).send(transformedImage)
    }
    catch (err) {
      return next(err)
    }
    finally {
      return next()
    }
  }
}
