const sharp = {
  resize: jest.fn().mockReturnThis(),
  toFormat: jest.fn().mockReturnThis(),
  toBuffer: jest.fn().mockReturnThis(),
}

export default jest.fn(() => sharp)
