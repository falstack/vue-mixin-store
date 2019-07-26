import storeInstance from '@/flow'
import { defaultListObj, generateFieldName } from '@/utils'

const Store = storeInstance({})

describe('store mutation update data', () => {
  let state
  const func = 'func'
  const type = 'page'
  const query = {}
  const fieldName = generateFieldName(func, type, query)

  beforeEach(() => {
    state = {}
  })

  it('result 是 array，调用 update，浅更新', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [
          {
            id: 1,
            val: 'a'
          },
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 2,
        no_more: true
      }
    })
    Store.mutations.UPDATE_DATA(state, {
      type,
      func,
      query,
      id: 1,
      method: 'update',
      key: 'val',
      value: 'c'
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        nothing: false,
        fetched: true,
        result: [
          {
            id: 1,
            val: 'c'
          },
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 2,
        page: 1,
        noMore: true
      })
    })
  })

  it('result 是 array，调用 update，深更新', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [
          {
            id: 1,
            val: {
              data: 'a'
            }
          },
          {
            id: 2,
            val: {
              data: 'b'
            }
          }
        ],
        total: 2,
        no_more: true
      }
    })
    Store.mutations.UPDATE_DATA(state, {
      type,
      func,
      query,
      id: 1,
      method: 'update',
      key: 'val.data',
      value: 'c'
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        nothing: false,
        fetched: true,
        result: [
          {
            id: 1,
            val: {
              data: 'c'
            }
          },
          {
            id: 2,
            val: {
              data: 'b'
            }
          }
        ],
        total: 2,
        page: 1,
        noMore: true
      })
    })
  })

  it('result 是 array，调用 modify，浅更新', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [
          {
            id: 1,
            val: 'a'
          },
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 2,
        no_more: true
      }
    })
    Store.mutations.UPDATE_DATA(state, {
      type,
      func,
      query,
      method: 'modify',
      key: 'total',
      value: 3
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        nothing: false,
        fetched: true,
        result: [
          {
            id: 1,
            val: 'a'
          },
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 3,
        page: 1,
        noMore: true
      })
    })
  })

  it('result 是 array，调用 modify，深更新', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [
          {
            id: 1,
            val: {
              data: 'a'
            }
          },
          {
            id: 2,
            val: {
              data: 'b'
            }
          }
        ],
        extra: {
          a: 'b'
        },
        total: 2,
        no_more: true
      }
    })
    Store.mutations.UPDATE_DATA(state, {
      type,
      func,
      query,
      id: 1,
      method: 'modify',
      key: 'extra.a',
      value: 'c'
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        nothing: false,
        fetched: true,
        result: [
          {
            id: 1,
            val: {
              data: 'a'
            }
          },
          {
            id: 2,
            val: {
              data: 'b'
            }
          }
        ],
        extra: {
          a: 'c'
        },
        page: 1,
        total: 2,
        noMore: true
      })
    })
  })

  it('result 是 array，调用 push', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [
          {
            id: 1,
            val: 'a'
          },
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 2,
        no_more: true
      }
    })
    Store.mutations.UPDATE_DATA(state, {
      type,
      func,
      query,
      method: 'push',
      value: {
        id: 3,
        val: 'c'
      }
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        nothing: false,
        fetched: true,
        result: [
          {
            id: 1,
            val: 'a'
          },
          {
            id: 2,
            val: 'b'
          },
          {
            id: 3,
            val: 'c'
          }
        ],
        total: 3,
        page: 1,
        noMore: true
      })
    })
  })

  it('result 是 array，调用 unshift', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [
          {
            id: 1,
            val: 'a'
          },
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 2,
        no_more: true
      }
    })
    Store.mutations.UPDATE_DATA(state, {
      type,
      func,
      query,
      method: 'unshift',
      value: {
        id: 3,
        val: 'c'
      }
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        nothing: false,
        fetched: true,
        result: [
          {
            id: 3,
            val: 'c'
          },
          {
            id: 1,
            val: 'a'
          },
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 3,
        page: 1,
        noMore: true
      })
    })
  })

  it('result 是 array，调用 concat', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [
          {
            id: 1,
            val: 'a'
          },
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 2,
        no_more: true
      }
    })
    Store.mutations.UPDATE_DATA(state, {
      type,
      func,
      query,
      method: 'concat',
      value: [
        {
          id: 3,
          val: 'c'
        },
        {
          id: 4,
          val: 'd'
        }
      ]
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        nothing: false,
        fetched: true,
        result: [
          {
            id: 1,
            val: 'a'
          },
          {
            id: 2,
            val: 'b'
          },
          {
            id: 3,
            val: 'c'
          },
          {
            id: 4,
            val: 'd'
          },
        ],
        total: 4,
        page: 1,
        noMore: true
      })
    })
  })

  it('result 是 array，调用 merge', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [
          {
            id: 1,
            val: 'a'
          },
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 2,
        no_more: true
      }
    })
    Store.mutations.UPDATE_DATA(state, {
      type,
      func,
      query,
      method: 'merge',
      value: [
        {
          id: 3,
          val: 'c'
        },
        {
          id: 4,
          val: 'd'
        }
      ]
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        nothing: false,
        fetched: true,
        result: [
          {
            id: 3,
            val: 'c'
          },
          {
            id: 4,
            val: 'd'
          },
          {
            id: 1,
            val: 'a'
          },
          {
            id: 2,
            val: 'b'
          },
        ],
        total: 4,
        page: 1,
        noMore: true
      })
    })
  })

  it('result 是 array，调用 patch，patch 是数组', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [
          {
            id: 1,
            val: 'a'
          },
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 2,
        no_more: true
      }
    })
    Store.mutations.UPDATE_DATA(state, {
      type,
      func,
      query,
      method: 'patch',
      value: [
        {
          id: 1,
          val: 'c'
        },
        {
          id: 2,
          val: 'd'
        }
      ]
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        nothing: false,
        fetched: true,
        result: [
          {
            id: 1,
            val: 'c'
          },
          {
            id: 2,
            val: 'd'
          },
        ],
        total: 2,
        page: 1,
        noMore: true
      })
    })
  })

  it('result 是 array，调用 patch，patch 是对象', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [
          {
            id: 1,
            val: 'a'
          },
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 2,
        no_more: true
      }
    })
    Store.mutations.UPDATE_DATA(state, {
      type,
      func,
      query,
      method: 'patch',
      value: {
        1: {
          val: 'c'
        },
        2: {
          val: 'd'
        }
      }
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        nothing: false,
        fetched: true,
        result: [
          {
            id: 1,
            val: 'c'
          },
          {
            id: 2,
            val: 'd'
          },
        ],
        total: 2,
        page: 1,
        noMore: true
      })
    })
  })

  it('result 是 array，调用 delete', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [
          {
            id: 1,
            val: 'a'
          },
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 2,
        no_more: true
      }
    })
    Store.mutations.UPDATE_DATA(state, {
      type,
      func,
      query,
      method: 'delete',
      id: 1
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        nothing: false,
        fetched: true,
        result: [
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 1,
        page: 1,
        noMore: true
      })
    })
  })

  it('result 是 array，调用 insert-before', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [
          {
            id: 1,
            val: 'a'
          },
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 2,
        no_more: true
      }
    })
    Store.mutations.UPDATE_DATA(state, {
      type,
      func,
      query,
      method: 'insert-before',
      id: 2,
      value: {
        id: 3,
        val: 'c'
      }
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        nothing: false,
        fetched: true,
        result: [
          {
            id: 1,
            val: 'a'
          },
          {
            id: 3,
            val: 'c'
          },
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 3,
        page: 1,
        noMore: true
      })
    })
  })

  it('result 是 array，调用 insert-after', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    Store.mutations.SET_DATA(state, {
      fieldName,
      data: {
        result: [
          {
            id: 1,
            val: 'a'
          },
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 2,
        no_more: true
      }
    })
    Store.mutations.UPDATE_DATA(state, {
      type,
      func,
      query,
      method: 'insert-after',
      id: 1,
      value: {
        id: 3,
        val: 'c'
      }
    })
    expect(state).toEqual({
      [fieldName]: Object.assign({}, defaultListObj, {
        nothing: false,
        fetched: true,
        result: [
          {
            id: 1,
            val: 'a'
          },
          {
            id: 3,
            val: 'c'
          },
          {
            id: 2,
            val: 'b'
          }
        ],
        total: 3,
        page: 1,
        noMore: true
      })
    })
  })
})
