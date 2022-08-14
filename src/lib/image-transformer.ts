import sharp from 'sharp'

import { QueryParams } from './types'

class ImageTransformer {
  async transform(
    image: string | Buffer,
    options: QueryParams,
  ): Promise<Buffer> {
    try {
      const transformedImage = sharp(image)

      await transformedImage.resize(options.width, options.height, {
        fit: 'cover',
        //withoutEnlargement: true,
      })

      if (options.format) {
        await transformedImage.toFormat(options.format, {
          quality: 100,
          progressive: true,
        })
      }
      return await transformedImage.toBuffer()
    } catch (err) {
      throw new Error(`An error occurred during transforming the image: ${err}`)
    }
  }
}

export { ImageTransformer }
