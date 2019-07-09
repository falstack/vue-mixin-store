import storeInstance from '@/flow'
import { defaultListObj, generateFieldName } from '@/utils'

const Store = storeInstance({})

describe('store mutation set state', () => {
  let state
  const func = 'func'
  const type = 'page'
  const query = {}
  const fieldName = generateFieldName(func, type, query)
  const error = {
    code: 500,
    message: 'xxx'
  }
  const data = {
    result: [1, 2, 3, 4, 5],
    no_more: true,
    total: 5
  }

  beforeEach(() => {
    state = {}
  })

  it('初始化 state', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    expect(state).toEqual({
      [fieldName]: defaultListObj
    })
    Store.mutations.INIT_STATE(state, { func, type, query })
    expect(state).toEqual({
      [fieldName]: defaultListObj
    })
    Store.mutations.INIT_STATE(state, { func: 'a', type: 'b' })
    expect(state).toEqual({
      [fieldName]: defaultListObj,
      [generateFieldName('a', 'b')]: defaultListObj
    })
  })

  it('设置 loading', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_LOADING(state, fieldName)
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        loading: true,
        error: null
      })
    })
  })

  it('设置 error', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_ERROR(state, { fieldName, error })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        loading: false,
        error: error
      })
    })
  })

  it('如果 type 是 jump 或者 result 是 object-array，在下次请求前清空 result', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      type,
      page: 1,
      insertBefore: false,
      fromLocal: false,
      cacheTimeout: 0,
      data: data
    })
    const afterState = Object.assign({}, defaultListObj, {
      result: data.result,
      total: data.total,
      noMore: data.no_more,
      page: 1,
      fetched: true
    })
    expect(state).toEqual({
      [fieldName]: afterState
    })
    Store.mutations.CLEAR_RESULT(state, fieldName)
    expect(state).toEqual({
      [fieldName]: Object.assign(afterState, {
        result: []
      })
    })
  })
})
