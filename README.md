# [lib-name]
[lib-name] is a node.js middleware for creating image servers. It provides middlewares for upload and process images in real time. For processing images the lib uses [sharp](https://sharp.pixelplumbing.com/), a high performance image processor for Node.js applications. And for uploading it uses [multer](https://github.com/expressjs/multer).


# Installation

```sh
$ yarn add [lib-name]
```

# Usage

```ts
import path from 'path'
import express from 'express'
import { LocalStorage, queryImageMiddleware } from '[lib-name]'

const app = express()

// Create a local storage client, from where the images will be fetched and saved.
const localStorage = new LocalStorage({
  dest: path.resolve(__dirname, '..', 'images'),
})

// Set the processing image middleware
app.get(
  '/images/:id',
  queryImageMiddleware({
    storage: localStorage
  }),
)

// Set the uploading image middleware
app.post(
  '/images',
  postMiddleware({
    storage: localStorage,
  }),
)

app.listen(3000)
```

# Storages

Storages classes are responsible for the communication with the image storage, which means in general fetch and send images to it.

Storages classes implements `Storage` interface and expose four functions:

- `save: (id: string, image: Buffer) => Promise<boolean>`
- `fetch: (id: string) => Promise<Buffer | undefined>`
- `exists: (id: string) => Promise<boolean>`
- `multerConfig?: () => StorageEngine`

**NOTE:** Note that `multerConfig` function is set as optional, but it is mandatory when using `postMiddleware`. This happens because this function returns the multer config used by `postMiddleware`.

[lib-name] provides two default storages: Disk Storage and Amazon S3 Storage.

## Disk Storage

```ts
import path from 'path'
import { localStorage } from '[lib-name]'

const destination = path.resolve(__dirname, '..', 'images')

const localStorage = new LocalStorage({
  dest: destination,
})
```

## Amazon S3

```ts
import { S3Storage } from '[lib-name]'

const s3Storage = new S3Storage({
  accessKeyId: 'access-key-id',
  bucketName: 'bucket-name',
  secretAccessKey: 'secret-access-key',
})
```

## Custom storage

