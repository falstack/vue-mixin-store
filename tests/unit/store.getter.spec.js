import storeInstance from '@/flow'
import { defaultListObj } from '@/utils'

const Store = storeInstance({})

describe('store getter', () => {
  let state
  const func = 'func'
  const type = 'page'
  const query = {}

  beforeEach(() => {
    state = {}
  })

  it('getFlow', () => {
    Store.mutations.INIT_STATE(state, { func, type, query })
    expect(Store.getters.getFlow(state)({ func, type, query })).toEqual(
      defaultListObj
    )
  })
})
