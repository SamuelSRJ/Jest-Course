import { DataBase } from "../../../app/server_app/data/DataBase";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import { Account } from "../../../app/server_app/model/AuthModel";
import * as IdGenerator from '../../../app/server_app/data/IdGenerator';

const mockInsert = jest.fn();
const mockGetBy = jest.fn();
const mockUpdate = jest.fn();

jest.mock('../../../app/server_app/data/DataBase', () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      return {
        insert: mockInsert,
        getBy: mockGetBy,
        update: mockUpdate
      }
    })
  }
})

const someAccount: Account = {
  id: '',
  password: 'somePassword',
  userName: 'someUserName'
}

describe('SessionTokenDataAccess test suite', () => {
  let sut: SessionTokenDataAccess;
  const fakeId = '1234';

  beforeEach(() => {
    sut = new SessionTokenDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
    jest.spyOn(global.Date, 'now').mockReturnValue(0);
    jest.spyOn(IdGenerator, 'generateRandomId').mockReturnValueOnce(fakeId);
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('Should generate token for account', async () => {
    mockInsert.mockResolvedValueOnce(fakeId);
    const actualTokenId = await sut.generateToken(someAccount);

    expect(actualTokenId).toBe(fakeId);
    expect(mockInsert).toHaveBeenCalledWith({
      id: '',
      userName: someAccount.userName,
      valid: true,
      expirationDate: new Date(1000*60*60)
    });
  });

  it('Should invalidade token', async () => {
    await sut.invalidateToken(fakeId);
    expect(mockUpdate).toHaveBeenCalledWith(fakeId, 'valid', false);
  })

  it('Should check valid token', async () => {
    mockGetBy.mockResolvedValueOnce({ valid: true});
    const actual = await sut.isValidToken({} as any);
    expect(actual).toBe(true);
  })

  it('Should check invalid token', async() => {
    mockGetBy.mockResolvedValueOnce({ valid: false });
    const actual = await sut.isValidToken({} as any);
    expect(actual).toBe(false);
  })

  it('Should check inexistent token', async () => {
    mockGetBy.mockResolvedValueOnce(undefined);
    const actual = await sut.isValidToken({} as any);
    expect(actual).toBe(false);
  })

})