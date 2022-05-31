import { config } from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import { imageMiddleware } from './middleware'

config()

const app = express()

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Express server with TypeScript')
})

// Use of image middleware
app.use('/images', imageMiddleware)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
