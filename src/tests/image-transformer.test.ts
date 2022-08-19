import sharp from 'sharp'

import { ImageTransformer } from '../image-transformer'
import { QueryParams } from '../types'

describe('ImageTransformer tests', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should perform all sharp operations expected', () => {
    const options: QueryParams = {
      height: 100,
      width: 100,
      format: 'png',
    }

    const buffer = Buffer.from('')

    const imageTransformer = new ImageTransformer()
    imageTransformer.transform(buffer, options)

    expect(sharp).toBeCalledTimes(1)
    expect(sharp().toBuffer).toBeCalledTimes(1)
    expect(sharp().resize).toBeCalledTimes(1)
    expect(sharp().toFormat).toBeCalledTimes(1)
  })

  it('Should not perform sharp toFormat when format is not passed', () => {
    const options: QueryParams = {
      height: 100,
      width: 100,
    }

    const buffer = Buffer.from('')

    const imageTransformer = new ImageTransformer()
    imageTransformer.transform(buffer, options)

    expect(sharp).toBeCalledTimes(1)
    expect(sharp().toBuffer).toBeCalledTimes(1)
    expect(sharp().resize).toBeCalledTimes(1)
    expect(sharp().toFormat).toBeCalledTimes(0)
  })
})
