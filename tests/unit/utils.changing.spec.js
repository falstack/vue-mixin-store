import { parseDataUniqueId } from '@/utils'

describe('parse data unique id', () => {
  const data = {
    id: 123,
    slug: 'abc',
    data: {
      unique_id: 456,
      nest: {
        key: 'dio'
      }
    }
  }

  it('changing 是 id', () => {
    const name = parseDataUniqueId(data, 'id')
    expect(name).toBe(123)
  })

  it('changing 是 slug', () => {
    const name = parseDataUniqueId(data, 'slug')
    expect(name).toBe('abc')
  })

  it('changing 是 object key', () => {
    const name = parseDataUniqueId(data, 'data.unique_id')
    expect(name).toBe(456)
  })

  it('changing 是 nest key', () => {
    const name = parseDataUniqueId(data, 'data.nest.key')
    expect(name).toBe('dio')
  })
})
