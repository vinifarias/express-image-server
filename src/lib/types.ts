import sharp from 'sharp'

enum FormatEnum {
  heic = 'heic',
  heif = 'heif',
  avif = 'avif',
  jpeg = 'jpeg',
  jpg = 'jpg',
  png = 'png',
  raw = 'raw',
  tiff = 'tiff',
  tif = 'tif',
  webp = 'webp',
  gif = 'gif',
  jp2 = 'jp2',
  jpx = 'jpx',
  j2k = 'j2k',
  j2c = 'j2c',
}

enum QueryParamsEnum {
  height = 'height',
  width = 'width',
  format = 'format',
}

interface QueryParams {
  height?: number
  width?: number
  format?: keyof sharp.FormatEnum
}

export { QueryParams, QueryParamsEnum, FormatEnum }
