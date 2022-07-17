import sharp from 'sharp'

import { QueryParams } from './types'

class ImageTransformer {
  async transform(
    image: string | Buffer,
    options: QueryParams,
  ): Promise<Buffer> {
    try {
      const transformedImage = sharp(image)

      transformedImage.resize(options.width, options.height, {
        fit: 'inside',
        withoutEnlargement: true,
      })

      if (options.format) {
        transformedImage.toFormat(options.format)
      }

      return await transformedImage.toBuffer()
    } catch (err) {
      throw new Error(`An error occurred during transforming the image: ${err}`)
    }
  }
}

export default ImageTransformer
