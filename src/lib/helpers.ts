import path from 'path'

import { QueryParams, QueryParamsEnum } from './types'

/**
 * Generate the name of the processed image. The name generated follows the
 *  format: <imgName>,<operation>-<value>.<filetype>
 * Example: image1,height-100,width-200.png
 * @param imgName
 * @param queryParams
 * @returns
 */
function generateNewImgName(
  imgName: string,
  queryParams: QueryParams,
): string {
  const { format, ...operations } = queryParams
  const imgFormat = format ? `.${format}` : path.extname(imgName)

  let newImgName = imgName.split('.')[0]

  // Concat operations and values in the name
  newImgName += Object.entries(operations)
    .sort((a: string[], b: string[]) => a[0].localeCompare(b[0]))
    .reduce((acc, curr) => {
      acc += `,${curr[0]}-${curr[1]}`
      return acc
    }, '')

  // Add file format
  newImgName += imgFormat

  console.log('IMAGE NAME: ', newImgName)

  return newImgName
}

function normalizeQuery(params: Record<string, any>): QueryParams {
  // Remove not allowed params
  const normalizedParams = Object.fromEntries(
    Object.entries(params).filter(([attr, _]) => attr in QueryParamsEnum),
  )

  if (Number.isNaN(normalizedParams.width)) {
    throw new Error('Erro normalizing query!')
  }

  if (normalizedParams.width) {
    normalizedParams.width = Number(params.width)
  }

  if (normalizedParams.height) {
    normalizedParams.height = Number(params.height)
  }

  return normalizedParams
}

export { generateNewImgName, normalizeQuery }
