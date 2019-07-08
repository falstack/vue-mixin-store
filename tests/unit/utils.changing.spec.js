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

  it('changing is id', () => {
    const name = parseDataUniqueId(data, 'id')
    expect(name).toBe(123)
  })

  it('changing is slug', () => {
    const name = parseDataUniqueId(data, 'slug')
    expect(name).toBe('abc')
  })

  it('changing is object key', () => {
    const name = parseDataUniqueId(data, 'data.unique_id')
    expect(name).toBe(456)
  })

  it('changing is nest key', () => {
    const name = parseDataUniqueId(data, 'data.nest.key')
    expect(name).toBe('dio')
  })
})
