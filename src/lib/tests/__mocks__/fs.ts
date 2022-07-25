const fs = {
  promises: {
    writeFile: jest.fn(),
    readFile: jest.fn(),
    stat: jest.fn().mockResolvedValue(true).mockRejectedValue(false),
  },
}

export default fs
