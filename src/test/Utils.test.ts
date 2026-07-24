import { getStringInfo, StringUtils, toUpperCase } from "../app/Utils"


describe.skip('Utils test suite', ()=> {

  describe('StringUtils test', ()=>{
    let sut: StringUtils;

    beforeEach(()=>{
      sut = new StringUtils();
    })

    // afterEach(()=>{
    //   // Clearing Mocks
    //   console.log('Teardown');
    // })

    it('Should return correct upperCase', ()=>{
      const actual = sut.toUpperCase('abc');

      expect(actual).toBe('ABC');
    })

    it('Should throw error on invalid argument - function', ()=>{
      function expectError(){
        const actual = sut.toUpperCase('');
      }
      expect(expectError).toThrow('Invalid argument!');
    })

    it('Should throw erro on invalid argument - arrow function', ()=>{
      expect(()=>{
        sut.toUpperCase('');
      }).toThrow('Invalid argument!');
    })

    it('Should throw error on invalid argument - try catch block', (done)=>{
      try {
        sut.toUpperCase('');
        done('GetStringInfo should throw error for invalid arg!');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Invalid argument!');
        done();
      }
    })

  })
  
  it('Should return uppercase of valid string', ()=> {
    // ARRANGE:
    const sut = toUpperCase;
    const expected = 'ABC';

    // ACT:
    const actual = sut('abc');

    // ASSERT:
    expect(actual).toBe(expected);
  })

  describe('toUpperCase examples', ()=>{
    it.each([
      {input: 'abc', expected: 'ABC'},
      {input: 'My-String', expected: 'MY-STRING'},
      {input: 'def', expected: 'DEF'},
    ])('$input to UpperCase should be $expected', ({input, expected})=>{
      const actual = toUpperCase(input);
      expect(actual).toBe(expected);
    })
  })

  describe('getStringInfo for arg My-String should', ()=>{
    test('return right lenght', ()=>{
      const actual = getStringInfo('My-String');
      expect(actual.characters).toHaveLength(9);
    });

    test('return right lower case', ()=>{
      const actual = getStringInfo('My-String');
      expect(actual.lowerCase).toBe('my-string');
    });

    test('return right upper case', ()=>{
      const actual = getStringInfo('My-String');
      expect(actual.upperCase).toBe('MY-STRING');
    })

    test('return right characters', ()=>{
      const actual = getStringInfo('My-String');
      expect(actual.characters).toEqual(['M', 'y', '-', 'S', 't', 'r', 'i', 'n', 'g']);
      expect(actual.characters).toContain<string>('M');
      expect(actual.characters).toEqual(
        expect.arrayContaining(['S', 't', 'r', 'i', 'n', 'g', 'M', 'y', '-'])
      )
    })

    test('return defined extra info', ()=> {
      const actual = getStringInfo('My-String');
      expect(actual.extraInfo).toBeDefined();
    })

    test('return right extra info', ()=>{
      const actual = getStringInfo('My-String');
      expect(actual.extraInfo).toEqual({})
    })
  })

  // it.only('Should return info for valid string', ()=> {
  //   const actual = getStringInfo('My-String');

  //   expect(actual.lowerCase).toBe('my-string');
  //   expect(actual.extraInfo).toEqual({});

  //   expect(actual.characters.length).toBe(9);
  //   expect(actual.characters).toHaveLength(9);

  //   expect(actual.characters).toEqual(['M', 'y', '-', 'S', 't', 'r', 'i', 'n', 'g']);
  //   expect(actual.characters).toContain<string>('M');
  //   expect(actual.characters).toEqual(
  //     expect.arrayContaining(['S', 't', 'r', 'i', 'n', 'g', 'M', 'y', '-'])
  //   )

  //   expect(actual.extraInfo).not.toBe(undefined);
  //   expect(actual.extraInfo).not.toBeUndefined();
  //   expect(actual.extraInfo).toBeDefined();
  //   expect(actual.extraInfo).toBeTruthy();
  // })

})