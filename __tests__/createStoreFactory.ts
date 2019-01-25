import { createStoreFactory } from '../src/index'
import { Middleware, ActionPayload } from '../src/typings'

test('useStore', () => {
  const middlewareA: Middleware = store => next => action => {
    console.log('start')
    console.log(store)
    next(action)
    console.log('end')
    console.log(store.getState())
  }

  const StoreFactory = createStoreFactory(middlewareA)

  const { dispatch, subscribe, getState } = StoreFactory({
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

  const listener = () => {
    console.log(getState())
  }

  const unSub = subscribe(listener)

  dispatch({
    type: 'increment',
    payload: 1,
  })

  console.log(unSub())

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
