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
    setDataToCache({
      key: 'field-work',
      value,
      expiredAt: 86400
    })
    const result = getDateFromCache({
      key: 'field-work',
      now: 0
    })
    expect(result).toEqual(value)
  })

  it('timeout', () => {
    setDataToCache({
      key: 'field-timeout',
      value: { a: 1 },
      expiredAt: 1000
    })
    const result = getDateFromCache({
      key: 'field-timeout',
      now: 2000
    })
    expect(result).toBeNull()
  })

  it('unset', () => {
    const result = getDateFromCache({
      key: 'field-unset',
      now: Date.now()
    })
    expect(result).toBeNull()
  })
})
