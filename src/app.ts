import path from 'path'

import { config } from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'

import { LocalStorageClient, queryImageMiddleware } from './lib'
import { postMiddleware } from './lib/image-uploader'

config()

const app = express()

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Express server with TypeScript')
})

// Create storage client for the use in middleware
const storageClient = new LocalStorageClient({
  dest: path.resolve(__dirname, '..', 'images'),
})

// Use of query image middleware
app.get(
  '/images/:id',
  queryImageMiddleware({
    storageClient,
    config: {},
  }),
)

// Use of post image middleware
app.post('/images', postMiddleware())

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
