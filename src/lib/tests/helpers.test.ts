import { generateFileName, normalizeQuery } from '../helpers'
import { QueryParams } from '../types'

describe('Test generateFileName', () => {
  it('Should generate file name correctly', () => {
    const options: QueryParams = {
      height: 100,
      width: 100,
      format: 'png',
    }

    const imgName = 'beauty-image.jpg'

    const expected = `${imgName.split('.')[0]},height-${options.height},width-${
      options.width
    }.${options.format}`

    expect(generateFileName(imgName, options)).toEqual(expected)
  })

  it('Should set the original file type in the generated file name', () => {
    const options: QueryParams = {
      height: 100,
      width: 100,
    }

    const imgName = 'beauty-image.jpg'

    const expected = `${imgName.split('.')[0]},height-${options.height},width-${
      options.width
    }.${imgName.split('.')[1]}`

    expect(generateFileName(imgName, options)).toEqual(expected)
  })
})

describe('Test normalizeQuery', () => {
  it('Should remove not expected params', async () => {
    const options = {
      height: 100,
      width: 100,
      format: 'png',
      wrongParam1: 'value1',
    }

    const { wrongParam1, ...expected } = options

    expect(normalizeQuery(options)).toMatchObject(expected)
  })

  it('Should throw an error when width or height are not numbers', () => {
    const options1 = {
      height: 'test',
      width: 100,
    }

    const options2 = {
      height: 100,
      width: 'test',
    }

    expect(() => normalizeQuery(options1)).toThrow()
    expect(() => normalizeQuery(options2)).toThrow()
  })

  it('Should convert height and width to number', () => {
    const options = {
      height: '100',
      width: '100',
    }

    const expected = {
      height: 100,
      width: 100,
    }

    expect(normalizeQuery(options)).toMatchObject(expected)
  })
})
