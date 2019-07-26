import { isArray } from '@/utils'

describe('safe utils', () => {
  it('isArray', () => {
    expect(isArray([])).toBeTruthy()
    expect(isArray({})).toBeFalsy()
  })
})
