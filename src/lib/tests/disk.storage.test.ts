// eslint-disable-next-line
import fsMock from './__mocks__/fs'

import fs from 'fs'

import multer from 'multer'

import { DiskStorage } from '../storages'

jest.mock('fs', () => fsMock)
jest.mock('multer')

const diskStorage = new DiskStorage({ dest: '' })

describe('DiskStorage tests', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should write file', () => {
    diskStorage.save('image.png', Buffer.from(''))

    expect(fs.promises.writeFile).toBeCalledTimes(1)
  })

  it('Should read file', () => {
    diskStorage.fetch('image.png')

    expect(fs.promises.readFile).toBeCalledTimes(1)
  })

  it('Should exec fs stat', () => {
    diskStorage.exists('image.png')

    expect(fs.promises.stat).toBeCalledTimes(1)
  })

  it('Should create a multer.diskStorage', () => {
    diskStorage.getMulterStorage()

    expect(multer.diskStorage).toBeCalledTimes(1)
  })
})
