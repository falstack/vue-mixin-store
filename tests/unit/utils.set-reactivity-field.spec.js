import { setReactivityField } from '@/utils'
import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()

describe('set reactivity field', () => {
  it('field 为空', () => {
    const field = {}
    const key = 'key'
    const value = 'value'
    setReactivityField(localVue.set, field, key, value)
    expect(field).toEqual({
      [key]: value
    })
  })

  it('type 是 jump 原先的值会被覆盖', () => {
    const field = {
      key: 'any_value will be reset'
    }
    const key = 'key'
    const value = 'value'
    setReactivityField(localVue.set, field, key, value, 'jump')
    expect(field).toEqual({
      [key]: value
    })
  })

  it('value 不是 array 原先的值会被覆盖', () => {
    const field = {
      key: [1, 2, 3, 4, 5]
    }
    const key = 'key'
    const value = { a: [], b: [], c: [] }
    setReactivityField(localVue.set, field, key, value, 'jump')
    expect(field).toEqual({
      [key]: value
    })
  })

  it('value 是 array，会 merge 到尾部', () => {
    const field = {
      key: [1, 2, 3, 4, 5]
    }
    const key = 'key'
    const value = [6, 7, 8, 9, 10]
    setReactivityField(localVue.set, field, key, value)
    expect(field).toEqual({
      [key]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    })
  })

  it('insertBefore 为 true，会 merge 到前面', () => {
    const field = {
      key: [1, 2, 3, 4, 5]
    }
    const key = 'key'
    const value = [6, 7, 8, 9, 10]
    setReactivityField(localVue.set, field, key, value, 'page', true)
    expect(field).toEqual({
      [key]: [6, 7, 8, 9, 10, 1, 2, 3, 4, 5]
    })
  })
})
