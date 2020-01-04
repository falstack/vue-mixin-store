import { generateFieldName } from '@/utils'

describe('generate field name', () => {
  const func = 'func'
  const type = 'type'

  it('query 为空', () => {
    const name = generateFieldName(func, type)
    expect(name).toBe('func-type')
  })

  it('query 过滤保留字', () => {
    const name = generateFieldName(func, type, {
      sort: 'desc',
      count: 10,
      page: 1,
      changing: 'slug',
      is_up: false,
      __refresh__: true
    })
    expect(name).toBe('func-type-count-10-sort-desc')
  })

  it('query 过滤 function、object、array、undefined', () => {
    const name = generateFieldName(func, type, {
      sort: 'hottest',
      empty: '',
      axios: () => {},
      object: {
        a: 1
      },
      count: 10,
      rank: null,
      defined: undefined,
      is_end: false,
      arr: [1, 2, 3]
    })
    expect(name).toBe('func-type-count-10-is_end-false-sort-hottest')
  })
})
