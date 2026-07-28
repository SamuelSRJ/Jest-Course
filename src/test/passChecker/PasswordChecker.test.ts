import { PasswordChecker, PasswordErros } from "../../app/passChecker/PasswordChecker"


describe('PasswordChecker test suite', () => {

  let sut: PasswordChecker;

  beforeEach(() => {
    sut = new PasswordChecker();
  })

  it('Should be invalid if password have less than 8 chars', () => {
    const actual = sut.checkPassword('1234567');
    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErros.SHORT);
  });

  it('Should be valid if password have at least 8 chars', () => {
    const actual = sut.checkPassword('12345678Aa');
    expect(actual.reasons).not.toContain(PasswordErros.SHORT)
  })

  it('Should be invalid if password have at least one upper case char', () => {
    const actual = sut.checkPassword('abcd');
    expect(actual.valid).toBe(false)
    expect(actual.reasons).toContain(PasswordErros.NO_UPPER_CASE);
  })

  it('Should be valid if password have at least one upper case char', () => {
    const actual = sut.checkPassword('abcdA');
    expect(actual.reasons).not.toContain(PasswordErros.NO_UPPER_CASE);
  })

  it('Password with no lower case letter is invalid', () => {
    const actual = sut.checkPassword('ABCD');
    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErros.NO_LOWER_CASE)
  })

  it('Password with lower case letter is valid', ()=> {
    const actual = sut.checkPassword('ABCDa');
    expect(actual.reasons).not.toContain(PasswordErros.NO_LOWER_CASE)
  })

  it('Complex password is valid', () => {
    const actual = sut.checkPassword('1234abcdA');
    expect(actual.valid).toBe(true);
    expect(actual.reasons).toHaveLength(0);
  })

  it('Admin password with no number is invalid', () => {
    const actual = sut.checkAdminPassword('abcdABCD');
    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErros.NO_NUMBER);
  })

  it('Admin password with number is valid', () => {
    const actual = sut.checkAdminPassword('abcdABCD1');
    expect(actual.reasons).not.toContain(PasswordErros.NO_NUMBER);
  })

})