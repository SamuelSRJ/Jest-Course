import { generateRandomId } from "../../../app/server_app/data/IdGenerator"


describe('IdGenerator test suite', () => {
  it('Should return a random string', () => {
    const randomId = generateRandomId();
    expect(randomId.length).toBe(20);
  })
})