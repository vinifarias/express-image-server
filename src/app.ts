import { config } from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import { LocalStorage, createMiddleware as imageMiddleware } from './lib'

config()

const app = express()

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Express server with TypeScript')
})

// Create storage client for the use in middleware
const storageClient = new LocalStorage({
  destination: path.resolve(__dirname, "..", "images")
})

// Use of image middleware
app.use('/images/:id', imageMiddleware({
  storageClient,
  config: {}
}))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
