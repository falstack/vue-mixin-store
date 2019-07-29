import storeInstance from '@/flow'
import { defaultListObj, generateFieldName } from '@/utils'

const Store = storeInstance({})

describe('store getter', () => {
  let state
  const func = 'func'
  const type = 'page'
  const query = {}
  const fieldName = generateFieldName(func, type, query)

  beforeEach(() => {
    state = {}
  })

  it('getFlow', () => {
    Store.mutations.INIT_STATE(state, fieldName)
    expect(Store.getters.getFlow(state)({ func, type, query })).toEqual(
      defaultListObj
    )
  })
})
