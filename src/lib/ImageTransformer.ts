import sharp from 'sharp'

interface QueryParams {
  height: number
  width: number
}

class ImageTransformer {
  async transform(imagePath: string | Buffer, params: QueryParams): Promise<Buffer | undefined> {

    try {
      const metadata = await sharp(imagePath).metadata()

      console.log('imageTransformer')
      console.log(metadata)
      return await sharp(imagePath).toBuffer()
    } catch (error) {
      console.log(`An error occurred during transforming: ${error}`);
    }
  }

  async resize(imagePath: string, params: QueryParams) {
    try {
      const paramsFormatted = { height: Number(params.height), width: Number(params.width) }
      const path = imagePath.split('.')
      const metadata = await sharp(imagePath).resize(paramsFormatted)
        .toFile(`${path[0]}-transformed.${path[1]}`)

      console.log('imageTransformer')
      console.log(metadata)
    } catch (error) {
      console.log(`An error occurred during resizing: ${error}`);
    }
  }

  async resizeAndCompress(imagePath: string, params: QueryParams) {
    try {
      const paramsFormatted = { height: Number(params.height), width: Number(params.width) }
      const path = imagePath.split('.')
      const metadata = await sharp(imagePath).resize(paramsFormatted)
        .toFormat("jpeg", { mozjpeg: true })
        .toFile(`${path[0]}-compressed.${path[1]}`)

      console.log('imageTransformer')
      console.log(metadata)
    } catch (error) {
      console.log(`An error occurred during resizing: ${error}`);
    }
  }

  async crop(imagePath: string, params: QueryParams) {
    try {
      const path = imagePath.split('.')
      const metadata = await sharp(imagePath)
        .extract({ width: 500, height: 330, left: 120, top: 70 })
        .toFile(`${path[0]}-cropped.${path[1]}`)

      console.log('imageTransformer')
      console.log(metadata)
    } catch (error) {
      console.log(`An error occurred during resizing: ${error}`);
    }
  }
}

export default ImageTransformer