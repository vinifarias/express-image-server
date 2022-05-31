import { NextFunction, Request, Response } from 'express'

interface QueryParams {
  height: number
  width: number
}

export function imageMiddleware(req: Request, res: Response, next: NextFunction) {
  const queryParams: QueryParams = req.query as unknown as QueryParams

  const storageClient = new StorageClient()
  const imageTransformer = new ImageTransformer()

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

  next()
}

// TODO
class ImageTransformer {
  async transform(params: QueryParams) {
    console.log('imageTransformer')
  }
}

// TODO
class StorageClient {
  constructor() {
    console.log('construct storage client')
  }

  async saveImage(image: string) {
    console.log('save image')
  }

  async getImage(id: string) {
    console.log('get image')
  }
}
