import { NextFunction, Request, Response } from 'express'
import { promises as fsPromises } from 'fs';
import * as path from 'path'
import sharp from 'sharp';

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
    const queryParams: QueryParams = req.query as unknown as QueryParams

    /**
     * let image = ''
     * if(image in cache) {
     *   image = ...image saved in cache
     * }
     * else {
     *  image = await storageClient.getImage(imageId)
     * }
     *
     * const imageTransformed = await imageTransformer.transform(image)
     *
     * storageClient.save({
     *   'name': blabla,
     *   'id': blabla,
     *   ...
     * }, imageTransformed)
     *
     * return imageTransformed
     */

    console.log('BASE URL: ', req.baseUrl)
    console.log('PARAMS: ', req.params)
    console.log('PATH: ', req.path)
    console.log('QUERY: ', req.query)
    console.log('PARSED QUERY: ', queryParams)
    const imageName = req.params.id

    const imageTransformer = new ImageTransformer()
    const storageClient = opts.storageClient

    // Get image from storage client
    const image = await storageClient.getImage(imageName)

    // Process the image
    const transformedImage = await imageTransformer.transform(image, queryParams)

    // Save the image
    if (transformedImage) {
      storageClient.saveImage("image-transformed.png", transformedImage)
    }

    next()
  }
}