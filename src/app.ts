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

// Create a disk storage client
const diskStorage = new DiskStorage({
  dest: path.resolve(__dirname, '..', 'images'),
})

// Create a AWS S3 storage client
const s3Storage = new S3Storage({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  bucketName: process.env.BUCKET_NAME!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_DEFAULT_REGION!,
})

// Use of query image middleware
app.get(
  '/images/:id',
  processMiddleware({
    storage: s3Storage,
    config: {},
  }),
)

// Use of post image middleware
app.post(
  '/images',
  uploadMiddleware({
    storage: s3Storage,
    config: {},
  }),
)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
