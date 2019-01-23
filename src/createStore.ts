import { useState } from 'react'

import produce from 'immer'
// import equal from 'fast-deep-equal'

import { useMount, useUnmount, getActionName } from './util'
import {
  Opt,
  Reducers,
  Effects,
  Selector,
  ReducerFn,
  ActionSelector,
  Updater,
  Action,
} from './typings'

function createStore<S, R extends Reducers<S>, E extends Effects>(opt: Opt<S, R, E>) {
  let storeState: S = opt.state
  const updaters: Array<Updater<S>> = []

  function useStore<P>(selector: Selector<S, P>) {
    const [state, setState] = useState(storeState)
    const updater = {
      update,
      set: setState,
    }

    useMount(() => {
      updaters.push(updater)
    })

    useUnmount(() => {
      updaters.splice(updaters.indexOf(updater), 1)
    })

    function update(
      set: any,
      reducer: ReducerFn<S>,
      action: Action<keyof (R & E) | ActionSelector<R, E>, any, any>,
    ): any {
      if (!reducer) return null

      const nextState: S = produce<any>(storeState, (draft: S) => {
        reducer(draft, action)
      })

      // TODO: prevent re-render
      // if (equal(selector(storeState), selector(nextState))) return

      storeState = nextState

      set(() => nextState)
    }

    return selector(state)
  }

  function dispatch<K extends any>(action: Action<keyof (R & E) | ActionSelector<R, E>, K, any>) {
    const type = action.type
    const actionName = getActionName(type)
    if (opt.effects && opt.effects[actionName]) {
      return opt.effects[actionName](action)
    }
    if (!updaters.length) return

    updaters.forEach(updater => {
      if (opt.reducers) {
        updater.update(updater.set, opt.reducers[actionName], action)
      }
    })
  }

  function getState(): S {
    return storeState
  }

  return { useStore, dispatch, getState }
}

export default createStore
export { createStore }
