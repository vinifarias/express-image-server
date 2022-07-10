import { FormatEnum, ResizeOptions } from 'sharp'

interface QueryParams {
  height?: number
  width?: number
  format?: keyof FormatEnum
}

enum QueryParamsEnum {
  height = 'height',
  width = 'width',
  format = 'format',
}

export { QueryParams, QueryParamsEnum }
