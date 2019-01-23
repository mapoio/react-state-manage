// import React from 'react'
// import renderer from 'react-test-renderer'
import { createStoreFactory, Middleware, ActionPayload } from '../src/index'

test('useStore', () => {
  const middlewareA: Middleware = store => next => action => {
    console.log('start')
    console.log(store)
    next(action)
    console.log('end')
  }

  const StoreFactory = createStoreFactory(middlewareA)

  const { useStore, dispatch } = StoreFactory({
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
          type: 'increment',
          payload: 2,
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

  console.log(useStore)

  // const App = () => {
  //   const count = useStore(S => S.count)
  //   console.log('coutn:------------------', count)
  //   // return <div>{count}</div>
  //   return <span>..</span>
  // }

  // console.log(<App />)

  // const component = renderer.create(<App />)
  // expect(component.toJSON()).toBe('1')
})
