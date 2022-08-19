import sharp from 'sharp'

import { QueryParams } from './types'

export class ImageTransformer {
  async transform(
    image: string | Buffer,
    options: QueryParams,
  ): Promise<Buffer> {
    try {
      const transformedImage = sharp(image)

      await transformedImage.resize(options.width, options.height, {
        fit: 'cover',
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
