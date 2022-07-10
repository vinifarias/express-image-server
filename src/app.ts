import path from 'path'

import { config } from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'

import { LocalStorage, queryImageMiddleware } from './lib'

config()

const app = express()

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Express server with TypeScript')
})

// Create storage client for the use in middleware
const storageClient = new LocalStorage({
  destination: path.resolve(__dirname, '..', 'images'),
})

// Use of image middleware
app.get(
  '/images/:id',
  queryImageMiddleware({
    storageClient,
    config: {},
  }),
)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
