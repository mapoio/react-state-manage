import { useState } from 'react'

import produce from 'immer'
// import equal from 'fast-deep-equal'

import { useMount, useUnmount, getActionName } from './util'
import { Opt, Reducers, Effects, Selector, ActionSelector, Updater } from './typings'

// let config: Config = {
//   rest: {
//     endpoint: '',
//   },
//   graphql: {
//     endpoint: '',
//     headers: {},
//   },
// }

const stamen = {
  // init: (initConfig: Config) => {
  //   config = initConfig
  // },
}

const createStore = <S, R extends Reducers<S>, E extends Effects>(opt: Opt<S, R, E>) => {
  const updaters: Array<Updater<S>> = []

  const useStore = <P extends any>(selector: Selector<S, P>) => {
    const [state, setState] = useState(opt.state)

    const update = (set: any, nextState: S): any => {
      set(() => nextState)
    }

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

    return selector(state)
  }

  const dispatch = <K extends any>(action: keyof (R & E) | ActionSelector<R, E>, payload?: K) => {
    const actionName = getActionName(action)
    if (opt.effects && opt.effects[actionName]) {
      return opt.effects[actionName](payload)
    }
    if (!updaters.length) return
    const runAction = opt.reducers && opt.reducers[actionName]
    if (runAction) {
      const nextState: S = produce<any>(opt.state, (draft: S) => {
        runAction(draft, payload)
      })
      // TODO: prevent re-render
      // if (equal(selector(storeState), selector(nextState))) return
      opt.state = nextState
      updaters.forEach(updater => {
        if (opt.reducers) {
          updater.update(updater.set, nextState)
        }
      })
    }
  }

  const getState = (): S => {
    return opt.state
  }

  return { useStore, dispatch, getState }
}

export default stamen
export { createStore }
