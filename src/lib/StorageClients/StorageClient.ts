interface StorageClient {
  saveImage: (imagePath: string, image: Buffer) => Promise<string>
  getImage: (id: string) => Promise<Buffer>
}

export default StorageClient