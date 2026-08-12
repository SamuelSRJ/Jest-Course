import { IncomingMessage } from "node:http"
import { getRequestBody } from "../../../app/server_app/utils/Utils"


const mockRequest = {
  on: jest.fn()
}

const someObject = {
  name: 'John',
  age: 30,
  city: 'Paris'
}

const someObjectAsString = JSON.stringify(someObject)

describe('getRequestBody test suite', () => {
  it('Should return object for valid JSON', async () => {
    mockRequest.on.mockImplementation((event, cb) => {
      if(event == 'data') {
        cb(someObjectAsString)
      } else {
        cb()
      }
    })

    const actual = await getRequestBody(
      mockRequest as any as IncomingMessage
    )

    expect(actual).toEqual(someObject)
  })

  it('Should throw error for invalid JSON', async () => {
    mockRequest.on.mockImplementation((event, cb) => {
      if(event == 'data') {
        cb('a' + someObjectAsString)
      } else {
        cb()
      }
    })

    await expect(getRequestBody(mockRequest as any)).rejects.
      toThrow('Unexpected token')
  })

  it('Should throw error for unexpected error', async () => {
    const someError = new Error('Something went wrong!')
    mockRequest.on.mockImplementation((event, cb) => {
      if(event == 'error') {
        cb(someError)
      }
    })
    await expect(getRequestBody(mockRequest as any)).rejects.
    toThrow(someError.message)
  })

})