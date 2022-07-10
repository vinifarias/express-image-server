import sharp from 'sharp'

import { QueryParams } from './types'

class ImageTransformer {
  async transform(
    image: string | Buffer,
    params: QueryParams,
  ): Promise<Buffer> {
    try {
      const transformedImage = sharp(image)

      if (params.width || params.height) {
        transformedImage.resize(params.width, params.height)
      }

      if (params.format) {
        transformedImage.toFormat(params.format)
      }

      return await transformedImage.toBuffer()
    } catch (err) {
      throw new Error(`An error occurred during transforming the image: ${err}`)
    }
  }
}

export default ImageTransformer
