import { getObjectDeepValue } from '@/utils'

describe('get object deep value', () => {
  const data = {
    id: 123,
    slug: 'abc',
    data: {
      unique_id: 456,
      deep: {
        key: 'dio'
      }
    }
  }

  it('keys 是 空', () => {
    const name = getObjectDeepValue(data)
    expect(name).toEqual(data)
  })

  it('keys 是 id', () => {
    const name = getObjectDeepValue(data, 'id')
    expect(name).toBe(123)
  })

  it('keys 是 slug', () => {
    const name = getObjectDeepValue(data, 'slug')
    expect(name).toBe('abc')
  })

  it('keys 是 object key', () => {
    const name = getObjectDeepValue(data, 'data.unique_id')
    expect(name).toBe(456)
  })

  it('keys 是 deep key', () => {
    const name = getObjectDeepValue(data, 'data.deep.key')
    expect(name).toBe('dio')
  })
})
