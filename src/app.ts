import path from 'path'

import { config } from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'

import {
  LocalStorageClient,
  S3StorageClient,
  queryImageMiddleware,
} from './lib'
import { postMiddleware } from './lib/image-uploader'

config()

const app = express()

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Express server with TypeScript')
})

// Create a local storage client
const localStorageClient = new LocalStorageClient({
  dest: path.resolve(__dirname, '..', 'images'),
})

// Create a local storage client
const s3StorageClient = new S3StorageClient({
  accessKeyId: 'sdfdsf',
  bucketName: 'sfsdf',
  secretAccessKey: 'sdfsdf',
})

// Use of query image middleware
app.get(
  '/images/:id',
  queryImageMiddleware({
    storage: localStorageClient,
    config: {},
  }),
)

// Use of post image middleware
app.post(
  '/images',
  postMiddleware({
    storage: localStorageClient,
    config: {},
  }),
)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
