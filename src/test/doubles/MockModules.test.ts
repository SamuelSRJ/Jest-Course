
jest.mock('../../app/doubles/OtherUtils', () => ({
  ...jest.requireActual('../../app/doubles/OtherUtils'),
  calculateComplexity: () => {return 10}
}));

jest.mock('uuid', () => ({
  v4: () => '123'
}))

import * as OtherUtils from '../../app/doubles/OtherUtils';

describe('module tests', () => {

  it('Calculate complexity', () => {
    const result = OtherUtils.calculateComplexity({} as any);
    // console.log(result);
  })

  test('Keep other functions', () => {
    const result = OtherUtils.toUpperCase('abc');
    expect(result).toBe('ABC');
  })

  it('String with ID', () => {
    const actual = OtherUtils.toLowerCaseWithID('ABC');
    expect(actual).toBe('abc123')
  })

})