import { useState, useEffect } from 'react'
import { createStore } from './createStore'
import { Opt, Reducers, Effects, Selector } from './typings'

function createHooksStore<S, R extends Reducers<S>, E extends Effects>(opt: Opt<S, R, E>) {
  const store = createStore(opt)
  function useStore<P>(selector: Selector<S, P>) {
    const [state, setState] = useState(store.getState())
    function handleStateChange() {
      const nextState = store.getState()
      setState(nextState)
    }
    useEffect(() => {
      const unsubscribe = store.subscribe(handleStateChange)
      return () => {
        unsubscribe()
      }
    })
    return selector(state)
  }
  return {
    ...store,
    useStore,
  }
}

export default createHooksStore
export { createHooksStore }
