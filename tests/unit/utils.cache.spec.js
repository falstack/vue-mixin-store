import { cacheNotExpired, readDataFromCache, setDataToCache } from '@/utils'

const timeout = duration =>
  new Promise(resolve => {
    setTimeout(resolve, duration)
  })

jest.useFakeTimers()

describe('timeout cache', () => {
  it('set/get cache', () => {
    const field = 'field'
    const value = {
      a: 1,
      b: [1, 2, 3, 4, 5],
      c: 'c',
      d: false,
      e: null,
      g: [{ a: 1 }, { b: 2 }]
    }
    setDataToCache(field, value)
    const result = readDataFromCache(field)
    expect(result).toEqual(value)
  })

  it('timeout', () => {
    setDataToCache('field', { a: 1 })
    expect.assertions(1)
    const pendingPromise = timeout(100).then(() => {
      // TODO 其实这里 result 肯定会返回 true，我不知道该怎么测这个 case
      const result = cacheNotExpired('field', 0.15) // 150ms
      expect(result).toBe(true)
    })

    jest.runAllTimers()

    return pendingPromise
  })
})
