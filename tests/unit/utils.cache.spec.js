import { getDateFromCache, setDataToCache } from '@/utils'

describe('timeout cache', () => {
  it('set/get cache', () => {
    const value = {
      a: 1,
      b: [1, 2, 3, 4, 5],
      c: 'c',
      d: false,
      e: null,
      g: [{ a: 1 }, { b: 2 }]
    }
    setDataToCache('field-work', value, 86400)
    const result = getDateFromCache('field-work', 0)
    expect(result).toEqual(value)
  })

  it('timeout', () => {
    setDataToCache('field-timeout', { a: 1 }, 1000)
    const result = getDateFromCache('field-timeout', 2000)
    expect(result).toBeNull()
  })

  it('unset', () => {
    const result = getDateFromCache('field-unset', Date.now())
    expect(result).toBeNull()
  })
})
