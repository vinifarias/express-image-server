import path from 'path'

import { config } from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'

import {
  DiskStorage,
  S3Storage,
  processMiddleware,
  uploadMiddleware,
} from './lib'

config()

const app = express()

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Express server with TypeScript')
})

// Create a local storage client
const diskStorage = new DiskStorage({
  dest: path.resolve(__dirname, '..', 'images'),
})

// Create a local storage client
/*const s3Storage = new S3Storage({
  accessKeyId: 'sdfdsf',
  bucketName: 'sfsdf',
  secretAccessKey: 'sdfsdf',
})*/

// Use of query image middleware
app.get(
  '/images/:id',
  processMiddleware({
    storage: diskStorage,
    config: {},
  }),
)

// Use of post image middleware
app.post(
  '/images',
  uploadMiddleware({
    storage: diskStorage,
    config: {},
  }),
)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
