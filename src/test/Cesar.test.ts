import { encode } from "../app/Cesar"

describe.only('Caesar Cipher - Encode', () => {

  it('abc becomes def with shift 3', () => {
    expect(encode('abc', 3)).toBe('def');
  })

  it('hi there! becomes ij uifsf! with shift 1', () => {
    expect(encode('hi there!', 1)).toBe('ij uifsf!')
  });

  it('...xyz? becomes ...zab? with shift 2', () => {
    const sut = encode;
    const expected = '...zab?';

    const actual = sut('...xyz?', 2);

    expect(actual).toBe(expected);
  });

  it('I LOVE js! /s becomes X ADKT yh! with shift 15', () => {
    const sut = encode;
    const expected = 'X ADKT yh!';

    const actual = sut('I LOVE js!', 15);

    expect(actual).toBe(expected);
  });

  it('1 + 2 = 3 not 3!  becomes 1 + 2 = 3 sty 3! with shift 5', () => {
    const sut = encode;
    const expected = '1 + 2 = 3 sty 3!';

    const actual = sut('1 + 2 = 3 not 3!', 5);

    expect(actual).toBe(expected);
  });

  it('Should encode a message entirely in lowercase with shift 7', () => {
    const sut = encode;
    const expected = 'zhtbls';

    const actual = sut('samuel', 7);

    expect(actual).toBe(expected);
  })

  it('Should encode a message keeping uppercase letters with shift 19', () => {
    const sut = encode;
    const expected = "Ltfnxe wx Lhnst";

    const actual = sut("Samuel de Souza", 19);

    expect(actual).toBe(expected);
  })

})