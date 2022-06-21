interface StorageClient {
  saveImage: (imagePath: string, image: Buffer) => Promise<string>
  getImage: (id: string) => Promise<Buffer>
  imageExists: (id: string) => Promise<boolean>
}

export default StorageClient