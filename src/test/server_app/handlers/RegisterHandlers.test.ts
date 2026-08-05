import { IncomingMessage, ServerResponse } from "http";
import { RegisterHandler } from "../../../app/server_app/handlers/RegisterHandler"
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { Account } from "../../../app/server_app/model/AuthModel";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";
import { getRequestBody } from "../../../app/server_app/utils/Utils";

const mockGetRequestBody = jest.fn();

jest.mock('../../../app/server_app/utils/Utils', () => ({
  getRequestBody: () => mockGetRequestBody()
}))

describe('RegisterHandlers test suite', () => {

  let sut: RegisterHandler;

  const request = {
    method: ''
  }

  const mockResponse = {
    statusCode: 0,
    writeHead: jest.fn(),
    write: jest.fn()
  }

  const mockAuthorizer = {
    registerUser: jest.fn()
  }

  const someAccount: Account = {
    id: '',
    password: 'somePassword',
    userName: 'someUserName'
  }

  const someId = '1234';

  beforeEach(() => {
    sut = new RegisterHandler(
      request as IncomingMessage,
      mockResponse as any as ServerResponse,
      mockAuthorizer as any as Authorizer
    )
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('Should register valid accounts in requests', async () => {
    request.method = HTTP_METHODS.POST;
    mockGetRequestBody.mockResolvedValueOnce(someAccount);
    mockAuthorizer.registerUser.mockResolvedValueOnce(someId);

    await sut.handleRequest();

    expect(mockResponse.statusCode).toBe(HTTP_CODES.CREATED);
    expect(mockResponse.writeHead).toHaveBeenCalledWith(
      HTTP_CODES.CREATED,
      { 'Content-Type': 'application/json' }
    )
    expect(mockResponse.write).toHaveBeenCalledWith(
      JSON.stringify({
        userId: someId
      })
    )
  })

  it('Should not register invalid accounts in request', async () => {
    request.method = HTTP_METHODS.POST;
    mockGetRequestBody.mockResolvedValueOnce({});

    await sut.handleRequest();

    expect(mockResponse.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(mockResponse.writeHead).toHaveBeenCalledWith(
      HTTP_CODES.BAD_REQUEST, { 'Content-Type': 'application/json' }
    )
    expect(mockResponse.write).toHaveBeenCalledWith(
      JSON.stringify('userName and password required')
    )
  });

  it('Should do nothing for not supported http methods', async () => {
    request.method = HTTP_METHODS.GET;
    await sut.handleRequest();

    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.write).not.toHaveBeenCalled();
    expect(mockGetRequestBody).not.toHaveBeenCalled();
  })

})