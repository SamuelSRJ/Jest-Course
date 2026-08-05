import { IncomingMessage, ServerResponse } from "node:http";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { LoginHandler } from "../../../app/server_app/handlers/LoginHandler";
import { Account } from "../../../app/server_app/model/AuthModel";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";
import { getRequestBody } from "../../../app/server_app/utils/Utils";

const mockGetRequestBody = jest.fn();

jest.mock("../../../app/server_app/utils/Utils", () => ({
  getRequestBody: () => mockGetRequestBody()
}));

describe("LoginHandler test suite", () => {
  let sut: LoginHandler;

  const request = {
    method: "",
  };

  const mockResponse = {
    writeHead: jest.fn(),
    write: jest.fn(),
    statusCode: 0,
  };

  const authorizerMock = {
    login: jest.fn(),
  };

  const someToken = "1234";

  const someAccount: Account = {
    id: "",
    password: "somePassword",
    userName: "someUserName",
  };

  beforeEach(() => {
    sut = new LoginHandler(
      request as IncomingMessage,
      mockResponse as any as ServerResponse,
      authorizerMock as any as Authorizer,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should return token for valid accounts in requests", async () => {
    request.method = HTTP_METHODS.POST;
    mockGetRequestBody.mockResolvedValueOnce(someAccount);
    authorizerMock.login.mockResolvedValueOnce(someToken);

    await sut.handleRequest();

    expect(authorizerMock.login).toHaveBeenCalledWith(
      someAccount.userName,
      someAccount.password,
    );
    expect(mockResponse.statusCode).toBe(HTTP_CODES.CREATED);
    expect(mockResponse.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, {
      "Content-Type": "application/json",
    });
    expect(mockResponse.write).toHaveBeenCalledWith(
      JSON.stringify({
        token: someToken,
      }),
    );
  });

  it("Should return not found for invalid accounts in requests", async () => {
    request.method = HTTP_METHODS.POST;
    mockGetRequestBody.mockReturnValueOnce(someAccount);
    authorizerMock.login.mockResolvedValueOnce(undefined);

    await sut.handleRequest();

    expect(authorizerMock.login).toHaveBeenCalledWith(
      someAccount.userName,
      someAccount.password,
    );
    expect(mockResponse.statusCode).toBe(HTTP_CODES.NOT_fOUND);
    expect(mockResponse.write).toHaveBeenCalledWith(
      JSON.stringify("wrong username or password"),
    );
  });

  it("Should return bad request for invalid requests", async () => {
    request.method = HTTP_METHODS.POST;
    mockGetRequestBody.mockReturnValueOnce({});

    await sut.handleRequest();

    expect(authorizerMock.login).not.toHaveBeenCalledWith();
    expect(mockResponse.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(mockResponse.write).toHaveBeenCalledWith(
      JSON.stringify("userName and password required"),
    );
  });

  it("Should do nothing for not supported http methods", async () => {
    request.method = HTTP_METHODS.GET;
    await sut.handleRequest();

    expect(mockResponse.writeHead).not.toHaveBeenCalled();
    expect(mockResponse.write).not.toHaveBeenCalled();
    expect(mockGetRequestBody).not.toHaveBeenCalled();
  });
});
