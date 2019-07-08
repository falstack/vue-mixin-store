import { cacheNotExpired, readDataFromCache, setDataToCache } from '@/utils'

describe('timeout cache', () => {
  it('set/get cache', () => {
    const field = 'field'
    const value = {
      a: 1,
      b: [
        1, 2, 3, 4, 5
      ],
      c: 'c',
      d: false,
      e: null,
      g: [
        { a: 1 },
        { b: 2 }
      ]
    }
    setDataToCache(field, value)
    const result = readDataFromCache(field)
    expect(result).toEqual(value)
  })

  // TODO 怎么测试 timeout cacheNotExpired
})
