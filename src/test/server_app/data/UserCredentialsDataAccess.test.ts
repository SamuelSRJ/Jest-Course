import { DataBase } from "../../../app/server_app/data/DataBase"
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess"
import { Account } from "../../../app/server_app/model/AuthModel";

const mockInsert = jest.fn();
const mockGetBy= jest.fn();

jest.mock('../../../app/server_app/data/DataBase', () => {
  return {
    DataBase : jest.fn().mockImplementation(() => {
      return {
        insert: mockInsert,
        getBy: mockGetBy
      }
    })
  }
})

describe('UserCredentialsDataAccess test suite', () => {

  let sut: UserCredentialsDataAccess;

  const someAccount: Account = {
    id: '',
    password: 'somePassword',
    userName: 'someUserName'
  }

  const someId = '1234'

  beforeEach(() => {
    sut = new UserCredentialsDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should add user and return the ID', async () => {
    mockInsert.mockResolvedValueOnce(someId);

    const actualId = await sut.addUser(someAccount);

    expect(actualId).toBe(someId);
    expect(mockInsert).toHaveBeenCalledWith(someAccount);
  });

  it('Should get user by ID', async () => {
    mockGetBy.mockResolvedValueOnce(someAccount);

    const actualUser = await sut.getUserById(someId);

    expect(actualUser).toEqual(someAccount);
    expect(mockGetBy).toHaveBeenCalledWith('id', someId);
  })

  it('Should get user by username', async () => {
    mockGetBy.mockResolvedValueOnce(someAccount);

    const actualUser = await sut.getUserByUserName(someAccount.userName);

    expect(actualUser).toEqual(someAccount);
    expect(mockGetBy).toHaveBeenCalledWith('userName', someAccount.userName);
  })

})