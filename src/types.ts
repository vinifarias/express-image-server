import { StorageEngine } from 'multer'
import sharp from 'sharp'

export enum FormatEnum {
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

export enum QueryParamsEnum {
  height = 'height',
  width = 'width',
  format = 'format',
}

export interface QueryParams {
  height?: number
  width?: number
  format?: keyof sharp.FormatEnum
}

export interface S3StorageOptions {
  region: string
  bucketName: string
  accessKeyId: string
  secretAccessKey: string
}

export interface DiskStorageOptions {
  dest: string
}

export interface Storage {
  save: (id: string, image: Buffer) => Promise<boolean>
  fetch: (id: string) => Promise<Buffer | undefined>
  exists: (id: string) => Promise<boolean>
  getMulterStorage?: () => StorageEngine
}
