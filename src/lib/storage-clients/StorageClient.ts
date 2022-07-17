interface StorageClient {
  save: (id: string, image: Buffer) => Promise<boolean>
  fetch: (id: string) => Promise<Buffer | undefined>
  exists: (id: string) => Promise<boolean>
}

export { StorageClient }
