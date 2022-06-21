import { NextFunction, Request, Response } from 'express'
import path from 'path'

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

export function createMiddleware(opts: optsType) {
  return async function imageMiddleware(req: Request, res: Response, next: NextFunction) {
    // Adapt to another image types
    res.set('Content-Type', 'image/jpg')

    const queryParams: QueryParams = req.query as unknown as QueryParams

    const imageName = req.params.id
    const newImageName = generateImageName(imageName, queryParams)

    const imageTransformer = new ImageTransformer()
    const storageClient = opts.storageClient

    // Check if the processed image already exist in storage
    if (await storageClient.imageExists(newImageName)) {
      const image = await storageClient.getImage(newImageName)
      res.send(image)
      return
    }

    // Get the image from storage
    const image = await storageClient.getImage(imageName)

    // Process the image
    const transformedImage = await imageTransformer.transform(image, queryParams)

    // Save the image
    if (transformedImage) {
      storageClient.saveImage(newImageName, transformedImage)
    }

    res.send(transformedImage)
    next()
  }
}

/**
 * Generate the name of the processed image. The name generated follows the
 *  format: <imageName>,<operation>-<value>.<filetype>
 * Example: image1,height-100,width-200.png
 * @param originalName
 * @param queryParams
 * @returns
 */
function generateImageName(originalName: string, queryParams: QueryParams): string {
  const newImageName = Object.entries(queryParams)
    .sort((a: string[], b: string[]) => a[0].localeCompare(b[0]))
    .reduce((acc, curr) => {
      acc += `,${curr[0]}-${curr[1]}`
      return acc
    }, '')

  return originalName.split('.')[0] + newImageName + path.extname(originalName)
}
