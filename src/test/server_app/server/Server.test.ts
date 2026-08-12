import { Server } from './../../../app/server_app/server/Server';
import { Authorizer } from "../../../app/server_app/auth/Authorizer"
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess"
import { RegisterHandler } from '../../../app/server_app/handlers/RegisterHandler';
import { LoginHandler } from '../../../app/server_app/handlers/LoginHandler';
import { ReservationsHandler } from '../../../app/server_app/handlers/ReservationsHandler';
import { HTTP_CODES } from '../../../app/server_app/model/ServerModel';

jest.mock('../../../app/server_app/auth/Authorizer')
jest.mock('../../../app/server_app/data/ReservationsDataAccess')
jest.mock('../../../app/server_app/handlers/RegisterHandler')
jest.mock('../../../app/server_app/handlers/LoginHandler')
jest.mock('../../../app/server_app/handlers/ReservationsHandler')

const mockRequest = {
  url: '',
  headers: {
    'user-agent': 'jest-test'
  }
}

const mockResponse = {
  end: jest.fn(),
  writeHead: jest.fn()
}

const mockServer = {
  listen: jest.fn(),
  close: jest.fn() 
}

jest.mock('http', () => ({
  createServer : (cb: Function) => {
    cb(mockRequest, mockResponse)
    return mockServer
  }
}))

describe('Server test suite', () => {
  let sut: Server

  beforeEach(() => {
    sut = new Server();
    expect(Authorizer).toHaveBeenCalledTimes(1);
    expect(ReservationsDataAccess).toHaveBeenCalledTimes(1);
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('Should start server on port 8080 and end the request', async () =>{
    await sut.startServer();

    expect(mockServer.listen).toHaveBeenCalledWith(8080);
    expect(mockResponse.end).toHaveBeenCalled();
  })

  it('Should handle register requests', async () => {
    mockRequest.url = 'localhost:8080/register'
    const handleRequestSpy = jest.spyOn(RegisterHandler.prototype, 'handleRequest');
    await sut.startServer();

    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(RegisterHandler).toHaveBeenCalledWith(mockRequest, mockResponse, expect.any(Authorizer));
  })

  it('Should handle login requests', async () => {
    mockRequest.url = 'localhost:8080/login'
    const handleRequestSpy = jest.spyOn(LoginHandler.prototype, 'handleRequest');
    await sut.startServer();

    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(LoginHandler).toHaveBeenCalledWith(mockRequest, mockResponse, expect.any(Authorizer));
  })

  it('Should handle reservation requests', async () => {
    mockRequest.url = 'localhost:8080/reservation'
    const handleRequestSpy = jest.spyOn(ReservationsHandler.prototype, 'handleRequest');
    await sut.startServer();

    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(ReservationsHandler).toHaveBeenCalledWith(
      mockRequest, 
      mockResponse, 
      expect.any(Authorizer),
      expect.any(ReservationsDataAccess)
    );
  })

  it('Should do nothing for not supported routes', async () => {
    mockRequest.url = 'localhost:8080/someRandomRoute'
    const validateTokenSpy = jest.spyOn(Authorizer.prototype, 'validateToken');
    
    await sut.startServer();

    expect(validateTokenSpy).not.toHaveBeenCalled();
  })

  it('Should handle error in serving requests', async () => {
    mockRequest.url = 'localhost:8080/reservation'
    const handleRequestSpy = jest.spyOn(ReservationsHandler.prototype, 'handleRequest');
    handleRequestSpy.mockRejectedValueOnce(
      new Error('Some error')
    )
    await sut.startServer();

    expect(mockResponse.writeHead).toHaveBeenCalledWith(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      JSON.stringify(`Internal server error: Some error`)
    )
  })

  it('Should stop the server if started', async () => {
    mockServer.close.mockImplementationOnce((cb: Function) => {
      cb();
    })
    await sut.startServer();

    await sut.stopServer();

    expect(mockServer.close).toHaveBeenCalledTimes(1);
  })

})