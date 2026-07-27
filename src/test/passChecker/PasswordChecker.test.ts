import { PasswordChecker } from "../../app/passChecker/PasswordChecker"


describe('PasswordChecker test suite', () => {

  let sut: PasswordChecker;

  beforeEach(() => {
    sut = new PasswordChecker();
  })

  it('Should be invalid if password have less than 8 chars', () => {
    const actual = sut.checkPassword('1234567');
    expect(actual).toBe(false);
  });

  it('Should be valid if password have at least 8 chars', () => {
    const actual = sut.checkPassword('12345678Aa');
    expect(actual).toBe(true);
  })

  it('Should be invalid if password have at least one upper case char', () => {
    const actual = sut.checkPassword('1234abcd');
    expect(actual).toBe(false);
  })

  it('Should be valid if password have at least one upper case char', () => {
    const actual = sut.checkPassword('1234abcdA');
    expect(actual).toBe(true);
  })

  it('Password with no lower case letter is invalid', () => {
    const actual = sut.checkPassword('1234ABCD');
    expect(actual).toBe(false);
  })

  it('Password with lower case letter is valid', ()=> {
    const actual = sut.checkPassword('1234ABCDa');
    expect(actual).toBe(true);
  })

})