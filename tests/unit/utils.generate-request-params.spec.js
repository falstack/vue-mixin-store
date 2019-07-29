import {
  generateRequestParams,
  defaultListObj,
  generateFieldName
} from '@/utils'
import storeInstance from '@/flow'

const Store = storeInstance({})

describe('generate request params', () => {
  let state
  const func = 'func'
  const type = 'page'
  const query = {}
  const fieldName = generateFieldName(func, type, query)

  beforeEach(() => {
    state = {}
  })

  it('初次请求，type 为 page，page 是 1', () => {
    const field = defaultListObj
    const query = {
      a: 'asd',
      b: 'asddd',
      page: 'abc'
    }
    const result = generateRequestParams(field, query, 'page')
    expect(result).toEqual({
      a: 'asd',
      b: 'asddd',
      page: 1
    })
  })

  it('初次请求，type 为 jump，page 是指定值或默认1', () => {
    const field = defaultListObj

    const query1 = {
      a: 'asd',
      b: 'asddd',
      page: 2
    }
    const result1 = generateRequestParams(field, query1, 'jump')
    expect(result1).toEqual({
      a: 'asd',
      b: 'asddd',
      page: 2
    })

    const query2 = {
      a: 'asd',
      b: 'asddd'
    }
    const result2 = generateRequestParams(field, query2, 'jump')
    expect(result2).toEqual({
      a: 'asd',
      b: 'asddd',
      page: 1
    })
  })

  it('初次请求，type 为 seenIds，seen_ids 是空字符串', () => {
    const field = defaultListObj
    const query = {
      a: 'asd',
      b: 'asddd'
    }
    const result = generateRequestParams(field, query, 'seenIds')
    expect(result).toEqual({
      a: 'asd',
      b: 'asddd',
      seen_ids: ''
    })
  })

  it('初次请求，type 为 lastId，last_id 是 0', () => {
    const field = defaultListObj
    const query = {
      a: 'asd',
      b: 'asddd'
    }
    const result = generateRequestParams(field, query, 'lastId')
    expect(result).toEqual({
      a: 'asd',
      b: 'asddd',
      last_id: 0
    })
  })

  it('初次请求，type 为 sinceId，since_id 默认是 0，is_up 是 0', () => {
    const field = defaultListObj
    const query = {
      a: 'asd',
      b: 'asddd'
    }
    const result = generateRequestParams(field, query, 'sinceId')
    expect(result).toEqual({
      a: 'asd',
      b: 'asddd',
      since_id: 0,
      is_up: 0
    })
  })

  it('初次请求，type 为 sinceId，如果 query 的 is_up 是 true，则 since_id 是 9个9，is_up 是 1', () => {
    const field = defaultListObj
    const query = {
      a: 'asd',
      b: 'asddd',
      is_up: true
    }
    const result = generateRequestParams(field, query, 'sinceId')
    expect(result).toEqual({
      a: 'asd',
      b: 'asddd',
      since_id: 999999999,
      is_up: 1
    })
  })

  it('非初次请求，type 为 page，page 是 field 的 page + 1', () => {
    Store.mutations.INIT_STATE(state, fieldName)
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [],
        no_more: true,
        total: 0
      },
      page: 1
    })
    const params = {
      a: 'asd',
      b: 'asddd',
      page: 666
    }
    const result = generateRequestParams(state[fieldName], params, 'page')
    expect(result).toEqual({
      a: 'asd',
      b: 'asddd',
      page: state[fieldName].page + 1
    })
  })

  it('非初次请求，type 为 jump，page 是 query 的 page 或 1', () => {
    Store.mutations.INIT_STATE(state, fieldName)
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [],
        no_more: true,
        total: 0
      },
      page: 1
    })
    const params = {
      a: 'asd',
      b: 'asddd',
      page: 666
    }
    const result = generateRequestParams(state[fieldName], params, 'jump')
    expect(result).toEqual(params)

    const params2 = {
      a: 'asd',
      b: 'asddd'
    }
    const result2 = generateRequestParams(state[fieldName], params2, 'jump')
    expect(result2).toEqual({
      a: 'asd',
      b: 'asddd',
      page: 1
    })
  })

  it('非初次请求，type 为 seenIds，seen_ids 是之前 result 的 unique_id 逗号拼接的字符串', () => {
    Store.mutations.INIT_STATE(state, fieldName)
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [{ id: 1 }, { id: 3 }, { id: 5 }, { id: 7 }, { id: 9 }],
        no_more: true,
        total: 0
      },
      page: 1
    })
    const params = {
      a: 'asd',
      b: 'asddd'
    }
    const result = generateRequestParams(state[fieldName], params, 'seenIds')
    expect(result).toEqual({
      a: 'asd',
      b: 'asddd',
      seen_ids: '1,3,5,7,9'
    })
  })

  it('非初次请求，type 为 lastId，last_id 是之前 result 数组最后一个值的 unique_id', () => {
    Store.mutations.INIT_STATE(state, fieldName)
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [{ id: 1 }, { id: 3 }, { id: 5 }, { id: 7 }, { id: 9 }],
        no_more: true,
        total: 0
      },
      page: 1
    })
    const params = {
      a: 'asd',
      b: 'asddd'
    }
    const result = generateRequestParams(state[fieldName], params, 'lastId')
    expect(result).toEqual({
      a: 'asd',
      b: 'asddd',
      last_id: 9
    })
  })

  it('非初次请求，type 为 sinceId，如果 query 的 is_up 是 true，则为 result 第 0 个值的 unique_id，并且 is_up 是 0', () => {
    Store.mutations.INIT_STATE(state, fieldName)
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [{ id: 1 }, { id: 3 }, { id: 5 }, { id: 7 }, { id: 9 }],
        no_more: true,
        total: 0
      },
      page: 1
    })
    const params = {
      a: 'asd',
      b: 'asddd'
    }
    const result = generateRequestParams(state[fieldName], params, 'sinceId')
    expect(result).toEqual({
      a: 'asd',
      b: 'asddd',
      is_up: 0,
      since_id: 9
    })
  })

  it('非初次请求，type 为 sinceId，如果 query 的 is_up 是 true，则为 result 最后一个值的 unique_id，并且 is_up 是 1', () => {
    Store.mutations.INIT_STATE(state, fieldName)
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [{ id: 1 }, { id: 3 }, { id: 5 }, { id: 7 }, { id: 9 }],
        no_more: true,
        total: 0
      },
      page: 1
    })
    const params = {
      a: 'asd',
      b: 'asddd',
      is_up: true
    }
    const result = generateRequestParams(state[fieldName], params, 'sinceId')
    expect(result).toEqual({
      a: 'asd',
      b: 'asddd',
      is_up: 1,
      since_id: 1
    })
  })
})
