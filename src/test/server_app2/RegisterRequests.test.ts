
import { DataBase } from "../../app/server_app/data/DataBase";
import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { RequestTestWrapper } from "./test_utils/RequestTestWrappers";
import { ResponseTestWrapper } from "./test_utils/ResponseTestWrapper";

// jest.mock('../../app/server_app/data/DataBase');

const mockRequestWrapper = new RequestTestWrapper();
const mockResponseWrapper = new ResponseTestWrapper();

const fakeServer = {
  listen: () => {},
  close: () => {},
}

jest.mock('http', () => ({
  createServer: (cb: Function) => {
    cb(mockRequestWrapper, mockResponseWrapper)
    return fakeServer;
  }
}))

describe('Register requests test suite', ()=> {

  afterEach(() => {
    mockRequestWrapper.clearFields();
    mockResponseWrapper.clearFields();
  })

  it('Should register new users', async ()=>{

    mockRequestWrapper.method = HTTP_METHODS.POST;
    mockRequestWrapper.body = {
      userName: 'someUserName',
      password: 'somePassword'
    };
    mockRequestWrapper.url = 'localhost:8080/register';
    jest.spyOn(DataBase.prototype, 'insert').mockResolvedValueOnce('1234');

    await new Server().startServer();

    await new Promise(process.nextTick) // This solves timing issues

    expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
    expect(mockResponseWrapper.body).toEqual(expect.objectContaining({
      userId: expect.any(String)
    }))
  })

  it('Should reject requests with no userName and password', async () => {
    mockRequestWrapper.method = HTTP_METHODS.POST;
    mockRequestWrapper.body = {};
    mockRequestWrapper.url = 'localhost:8080/register';

    await new Server().startServer();

    await new Promise(process.nextTick) // This solves timing issues

    expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(mockResponseWrapper.body).toBe('userName and password required')
  })

  it('Should do nothing for not supported methods', async () => {
    mockRequestWrapper.method = HTTP_METHODS.DELETE;
    mockRequestWrapper.body = {};
    mockRequestWrapper.url = 'localhost:8080/register';

    await new Server().startServer();

    await new Promise(process.nextTick) // This solves timing issues

    expect(mockResponseWrapper.statusCode).toBeUndefined();
    expect(mockResponseWrapper.body).toBeUndefined();
  })

})