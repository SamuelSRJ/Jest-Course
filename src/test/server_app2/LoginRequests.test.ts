import { DataBase } from "../../app/server_app/data/DataBase";
import { Account } from "../../app/server_app/model/AuthModel";
import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { RequestTestWrapper } from "./test_utils/RequestTestWrappers";
import { ResponseTestWrapper } from "./test_utils/ResponseTestWrapper";



jest.mock('../../app/server_app/data/DataBase');

const mockRequestWrapper = new RequestTestWrapper();
const mockResponseWrapper = new ResponseTestWrapper();

const fakeServer = {
  listen: () => {},
  close: () => {},
}

jest.mock('http', () => ({
  createServer: (cb: any) => {
    cb(mockRequestWrapper, mockResponseWrapper)
    return fakeServer;
  }
}))

const someAccount: Account = {
  id: '',
  password: 'somePassword',
  userName: 'someUserName',
}

const someToken = '1234';

const jsonHeader = { 'Content-Type': 'application/json' }

describe('Login requests', () => {

  const insertSpy = jest.spyOn(DataBase.prototype, 'insert');
  const getBySpy = jest.spyOn(DataBase.prototype, 'getBy');

  beforeEach(() => {
    mockRequestWrapper.clearFields();
    mockResponseWrapper.clearFields();
    jest.clearAllMocks();
  })

  it('Should login user with valid credentials', async () => {
    mockRequestWrapper.method = HTTP_METHODS.POST;
    mockRequestWrapper.body = someAccount;
    mockRequestWrapper.url = 'localhost:8080/login';
    getBySpy.mockResolvedValueOnce(someAccount);
    insertSpy.mockResolvedValueOnce(someToken);

    await new Server(). startServer();

    await new Promise(process.nextTick); // This solves timing issues

    expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
    expect(mockResponseWrapper.body).toEqual({
      token: someToken
    })
    expect(mockResponseWrapper.headers).toContainEqual(jsonHeader);
  })

  it('Should not login user with invalid credentials', async () => {
    mockRequestWrapper.method = HTTP_METHODS.POST;
    mockRequestWrapper.body = someAccount;
    mockRequestWrapper.url = 'localhost:8080/login';
    getBySpy.mockResolvedValueOnce({
      userName: 'someOtherUserName',
      password: 'someOtherPassword'
    });

    await new Server().startServer();

    await new Promise(process.nextTick); // This solves timing issues

    expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.NOT_fOUND);
    expect(mockResponseWrapper.body).toEqual('wrong username or password');
  });

  it('Should return bad request id no credentials in request', async () => {

    mockRequestWrapper.method = HTTP_METHODS.POST;
    mockRequestWrapper.body = {};
    mockRequestWrapper.url = 'localhost:8080/login';

    await new Server().startServer();

    await new Promise(process.nextTick); // This solves timing issues

    expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(mockResponseWrapper.headers).toContainEqual(jsonHeader);
    expect(mockResponseWrapper.body).toEqual('userName and password required')
  })

  it('Should do nothing for not supported methods', async () => {

    mockRequestWrapper.method = HTTP_METHODS.DELETE;
    mockRequestWrapper.body = {};
    mockRequestWrapper.url = 'localhost:8080/login';

    await new Server().startServer();

    await new Promise(process.nextTick); // This solves timing issues

    expect(mockResponseWrapper.statusCode).toBeUndefined();
    expect(mockResponseWrapper.headers).toHaveLength(0);
    expect(mockResponseWrapper.body).toBeUndefined();
  })

})