import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";


const mockIsValidToken = jest.fn();
const mockGenerateToken = jest.fn();
const mockInvalidateToken = jest.fn();

jest.mock('../../../app/server_app/data/SessionTokenDataAccess', () => {
  return {
    SessionTokenDataAccess: jest.fn().mockImplementation(() => {
      return {
        isValidToken: mockIsValidToken,
        generateToken: mockGenerateToken,
        invalidateToken: mockInvalidateToken
      }
    })
  }
})

const mockAddUser = jest.fn();
const mockGetUserByUserName = jest.fn();
jest.mock('../../../app/server_app/data/UserCredentialsDataAccess', () => {
  return {
    UserCredentialsDataAccess: jest.fn().mockImplementation(() => {
      return {
        addUser: mockAddUser,
        getUserByUserName: mockGetUserByUserName
      }
    })
  }
});

describe('Authorizer test suite', () => {
  let sut: Authorizer;

  const someId = '1234';
  const someUserName = 'someUserName';
  const somePassword = 'somePassword';

  beforeEach(() => {
    sut = new Authorizer();
    expect(SessionTokenDataAccess).toHaveBeenCalledTimes(1);
    expect(UserCredentialsDataAccess).toHaveBeenCalledTimes(1);
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('Should validate token', async () => {
    mockIsValidToken.mockResolvedValueOnce(false);

    const actual = await sut.validateToken(someId);

    expect(actual).toBe(false);
  })

  it('Should return id for new registered user', async () => {
    mockAddUser.mockResolvedValueOnce(someId);

    const actual = await sut.registerUser(someUserName, somePassword);

    expect(actual).toBe(someId);
    expect(mockAddUser).toHaveBeenCalledWith({
      id: '',
      password: somePassword,
      userName: someUserName
    })
  });

  it('Should return tokenId for valid credentials', async () => {
    mockGetUserByUserName.mockResolvedValueOnce({
      password: somePassword
    })
    mockGenerateToken.mockResolvedValueOnce(someId);

    const actual = await sut.login(someUserName, somePassword);

    expect(actual).toBe(someId);
  });

  it('Should return undefined for invalid credentials', async () => {
    mockGetUserByUserName.mockResolvedValueOnce({
      password: somePassword
    })
    mockGenerateToken.mockResolvedValueOnce(someId);

    const actual = await sut.login(someUserName, 'someOtherPassword');

    expect(actual).toBeUndefined();
  });

  it('Should invalidade token on logout call', async () => {
    await sut.logout(someId);

    expect(mockInvalidateToken).toHaveBeenCalledWith(someId);
  })

})