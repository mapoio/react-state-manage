import { useState } from 'react'

import produce from 'immer'
import cloneDeep from 'clone-deep'
// import equal from 'fast-deep-equal'

import { useMount, useUnmount, getActionName } from './util'
import {
  Opt,
  Reducers,
  Effects,
  Selector,
  ActionSelector,
  Updater,
  beforeDispatchFunc,
  afterDispatchFunc,
  Config,
  beforeUpdateFunc,
} from './typings'

const config: Config = {
  beforeDispatchs: [],
  afterDispatchs: [],
  beforeUpdates: [],
}

const store = {
  init: (initConfig: Partial<Config>) => {
    Object.assign(config, initConfig)
  },
}

const createStore = <S, R extends Reducers<S>, E extends Effects>(opt: Opt<S, R, E>) => {
  const updaters: Array<Updater<S>> = []
  const beforeDispatchs: beforeDispatchFunc[] = config.beforeDispatchs
  const afterDispatchs: afterDispatchFunc[] = config.afterDispatchs
  const beforeUpdates: beforeUpdateFunc[] = config.beforeUpdates
  let prevState: S = cloneDeep(opt.state)

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
    beforeDispatchs.forEach(func => func(cloneDeep(opt.state), actionName, payload))
    if (opt.effects && opt.effects[actionName]) {
      return opt.effects[actionName](payload)
    }
    if (!updaters.length) return
    const runAction = opt.reducers && opt.reducers[actionName]
    if (runAction) {
      const nextState: S = produce<any>(opt.state, (draft: S) => {
        runAction(draft, payload)
      })
      // if (equal(opt.state, nextState)) return

      prevState = cloneDeep(opt.state)

      beforeUpdates.forEach(func => {
        func(cloneDeep(prevState), cloneDeep(nextState), actionName, payload)
      })

      opt.state = nextState
      updaters.forEach(updater => {
        updater.update(updater.set, nextState)
      })
    }
    afterDispatchs.forEach(func => func(cloneDeep(opt.state), actionName, payload))
  }

  const getState = (): S => {
    return opt.state
  }

  return { useStore, dispatch, getState }
}

export default store
export { createStore }
