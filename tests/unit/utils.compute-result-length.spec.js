import { computeResultLength } from '@/utils'

describe('compute result length', () => {
  it('空数组返回 0', () => {
    expect(computeResultLength([])).toBe(0)
  })

  it('空对象返回 0', () => {
    expect(computeResultLength({})).toBe(0)
  })

  it('数组返回数组长度', () => {
    const result = [1, 2, 3, 4, 5]
    expect(computeResultLength(result)).toBe(result.length)
  })

  it('object-array 返回数组长度', () => {
    const result = {
      a: [1, 2, 3],
      b: [4, 5],
      c: []
    }
    expect(computeResultLength(result)).toBe(5)
  })
})
