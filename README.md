# [lib-name] <!-- omit in toc -->
[lib-name] is a node.js middleware for creating image servers. It provides middlewares for search, process and upload images in real time. For processing images the lib uses [sharp](https://sharp.pixelplumbing.com/), a high performance image processor for Node.js applications. And for uploading images it uses [multer](https://github.com/expressjs/multer).

## Table of contents <!-- omit in toc -->

- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Middlewares](#middlewares)
  - [```processMiddleware(options)```](#processmiddlewareoptions)
    - [Avaible image operations](#avaible-image-operations)
  - [```uploadMiddleware(options)```](#uploadmiddlewareoptions)
- [Storages](#storages)
  - [Disk Storage](#disk-storage)
  - [Amazon S3 Storage](#amazon-s3-storage)
  - [Custom Storage](#custom-storage)

## Installation

```sh
$ yarn add [lib-name]
```
## Basic usage

```ts
import path from 'path'
import express from 'express'
import { DiskStorage, processMiddleware, uploadMiddleware } from '[lib-name]'

const app = express()

// Create a local storage client, from where the images will be fetched and saved.
const diskStorage = new DiskStorage({
  dest: path.resolve(__dirname, '..', 'images'),
})

// Set the processing image middleware
app.get(
  '/images/:id',
  processMiddleware({
    storage: diskStorage
  }),
)

// Set the uploading image middleware
app.post(
  '/images',
  uploadMiddleware({
    storage: diskStorage,
  }),
)

app.listen(3000)
```

## Middlewares

### ```processMiddleware(options)```

This middleware is used for search and process images. For processing and transforming images it uses [sharp](https://sharp.pixelplumbing.com/).

Example:

```ts
import { processMiddleware } from '[lib-name]'

const app = express()

app.get(
  '/images/:id',
  processMiddleware({
    storage: ...
  }),
)

app.listen(3000)
```

> **NOTE:** This middleware expects an `id` in URL params. The `id` is the original name of the image in the storage.

With this middleware the route will accept request with the following structure:

```             
           Express app        Endpoint      Image id              Operations
      ┌────────────────────┐┌──────────┐┌─────────────┐┌──────────────────────────────┐
GET   https://my-domain.com/path/images/image-name.png?height=720&width=1080&format=jpg
```

That request will process the image `image-name.png` with the operations and will return as response `image-name.jpg` in `1080x720` dimension. **Also, it will save in the storage the image `image-name,height-720,width-1080.jpg`**.

The following are the options that can be passed to `processMiddleware`:
| Key       | Description                          | Note               |
| --------- | ------------------------------------ | ------------------ |
| `storage` | Where to search and store the images | An `Storage` class |
|           |                                      |

**This middleware follows the algorithm:**
1) Checks if the image processed with the operations asked already exist in the storage;
2) If *yes*:
   1) Fetch the processed image;
   2) Return it in the response;
3) If *not*:
   1) Fetch the original image (by the `id` URL param);
   2) Process the image with the operations asked;
   3) Save the processed image in the storage for future requests;
   4) Return it in the response;

#### Avaible image operations

| Query param name | Description                                                       |
| ---------------- | ----------------------------------------------------------------- |
| width            | Output image's width                                              |
| height           | Output image's height                                             |
| format           | Output image format. Valid values: `jpeg`, `jpg`, `png` or `webp` |

### ```uploadMiddleware(options)```

This middleware is used for uploading images direct to the storage and it is built on top of [multer](https://github.com/expressjs/multer).

Example:

```ts
import { uploadMiddleware } from '[lib-name]'

const app = express()

app.post(
  '/images',
  uploadMiddleware({
    storage: ...,
  }),
)

app.listen(3000)
```

With this middleware the route will accept POST requests to save a *single* image at a time. To properly work, the request's body must be set as `form-data` and the image file must be sent in `file` parameter. **The image will be sent to the storage with the file's name.**

The following are the options that can be passed to `uploadMiddleware`:
| Key       | Description               | Note               |
| --------- | ------------------------- | ------------------ |
| `storage` | Where to store the images | An `Storage` class |
|           |                           |

> NOTE: This middleware requires that the storage class used has the `getMulterStorage` function, which will be used to config *multer* internally.

## Storages

Storages classes are responsible for the communication to the image storage, which means in general fetch and send images to it.

Storages classes implements `Storage` interface and expose four functions:

- `save: (id: string, image: Buffer) => Promise<boolean>`
- `fetch: (id: string) => Promise<Buffer | undefined>`
- `exists: (id: string) => Promise<boolean>`
- `getMulterStorage?: () => multer.StorageEngine`

> **NOTE:** `getMulterStorage` function is set as optional, but it is **mandatory** when using `uploadMiddleware`. This happens because this function returns the multer storage config used by that middleware.

[lib-name] provides two default storages: Disk Storage and Amazon S3 Storage.

### Disk Storage

Searches and stores images in the hard disk.

```ts
import path from 'path'
import { DiskStorage } from '[lib-name]'

const destination = path.resolve(__dirname, '..', 'images')

const diskStorage = new DiskStorage({
  dest: destination,
})
```

For the multer config uses [multer.DiskStorage](https://github.com/expressjs/multer#diskstorage) engine.

### Amazon S3 Storage

Searches and stores images in Amazon S3.

```ts
import { S3Storage } from '[lib-name]'

const s3Storage = new S3Storage({
  bucketName: 'bucket-name',
  accessKeyId: 'access-key-id',
  secretAccessKey: 'secret-access-key',
  region: 'region'
})
```

For the multer config uses [multerS3](https://github.com/anacronw/multer-s3) lib, that export an multer store engine for AWS S3.

### Custom Storage
You can create your own custom storage class. You just have to define a class that implements the `Storage` interface. Check the example:

```ts
import { Storage } from '[lib-name]'

class MyCustomStorage implements Storage {
  constructor(/*{...your options}*/) {
    ...
  }

  async save(id: string, image: Buffer): Promise<boolean> {
    ...
  }

  async fetch(id: string): Promise<Buffer | undefined> {
    ...
  }

  async exists(id: string): Promise<boolean> {
    ...
  }

  getMulterStorage(): StorageEngine {
    ...
  }
}
```

To implement your own `multer.StoreEngine` or to see the standard ones, please check the [multer's documentation](https://github.com/expressjs/multer#readme).
