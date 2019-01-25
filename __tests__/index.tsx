import React from 'react'
import renderer from 'react-test-renderer'
// import { shallow } from 'enzyme'
import { createHooksStoreFactory } from '../src/index'
import { Middleware, ActionPayload } from '../src/typings'

test('useStore', () => {
  const middlewareA: Middleware = store => next => action => {
    console.log('start')
    console.log(store)
    next(action)
    console.log('end')
  }

  const StoreFactory = createHooksStoreFactory(middlewareA)

  const { dispatch, useStore } = StoreFactory({
    state: {
      count: 10,
      name: 'Counter',
    },
    reducers: {
      increment(state, action: ActionPayload<number>) {
        state.count += action.payload || 2
        state.name = 'test'
      },
      decrement(state) {
        state.count--
      },
    },
    effects: {
      async asyncIncrement() {
        await sleep(1000)
        dispatch<number>({
          type: s => s.asyncDecrement,
          payload: 2,
        })
        dispatch({
          type: 'decrement',
          qw: '12',
        })
      },
      async asyncDecrement() {
        await sleep(1000)
        dispatch({
          type: 'decrement',
        })
      },
    },
  })

  dispatch({
    type: 'decrement',
  })

  function sleep(time: number) {
    return new Promise(resove => {
      setTimeout(() => {
        resove()
      }, time)
    })
  }

  const App = () => {
    const count = useStore(S => S.count)
    return <div>{count}</div>
  }

  const component = renderer.create(<App />)
  const root = JSON.parse(JSON.stringify(component.toJSON()))
  expect(root.type).toBe('div')
  expect(root.children[0]).toBe('9')

  dispatch({
    type: 'decrement',
  })

  dispatch({
    type: 'decrement',
  })

  console.log(component.toJSON())
  // expect(component.toTree().children[0]).toBe('9')
  // const app = shallow(<App />)
  // expect(app.find('div').text()).toBe('9')
})
