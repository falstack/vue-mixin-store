import { updateReactivityField } from '@/utils'
import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()

describe('update reactivity field', () => {
  it('value 为数组', () => {
    const field = [
      {
        id: 1,
        a: 'a',
        b: 'b'
      },
      {
        id: 2,
        a: 'c',
        b: 'd'
      }
    ]
    const value = [
      {
        id: 1,
        a: 'e'
      }
    ]
    updateReactivityField(localVue.set, field, value, 'id')
    expect(field).toEqual([
      {
        id: 1,
        a: 'e',
        b: 'b'
      },
      {
        id: 2,
        a: 'c',
        b: 'd'
      }
    ])
  })

  it('value 为对象', () => {
    const field = [
      {
        id: 1,
        a: 'a',
        b: 'b'
      },
      {
        id: 2,
        a: 'c',
        b: 'd'
      }
    ]
    const value = {
      1: {
        a: 'e'
      }
    }
    updateReactivityField(localVue.set, field, value, 'id')
    expect(field).toEqual([
      {
        id: 1,
        a: 'e',
        b: 'b'
      },
      {
        id: 2,
        a: 'c',
        b: 'd'
      }
    ])
  })
})
