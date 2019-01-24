// import { useState } from 'react'
import produce from 'immer'
// import equal from 'fast-deep-equal'

import { getActionName, ActionTypes } from './util'
import { Opt, Reducers, Effects, ActionSelector, Action, Func } from './typings'

function createStore<S, R extends Reducers<S>, E extends Effects>(opt: Opt<S, R, E>) {
  if (typeof opt !== 'object' || !opt) {
    throw new Error('Expected the reducer to be a object.')
  }

  let storeState: S = opt.state
  let currentListeners: Array<() => any> = []
  let nextListeners = currentListeners
  let isDispatching = false

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }

  function dispatch<K extends any>(
    action: Action<keyof (R & E) | ActionSelector<R, E>, K, any> | Func,
  ) {
    if (typeof action === 'function') {
      throw new Error(
        'Actions must be plain objects. ' + 'Use custom middleware for async actions.',
      )
    }
    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?',
      )
    }
    const type = action.type
    const actionName = getActionName(type)
    if (opt.effects && opt.effects[actionName]) {
      return opt.effects[actionName](action)
    }
    if (!currentListeners.length) return
    if (opt.reducers) {
      try {
        isDispatching = true
        const nextState: S = produce<any>(storeState, (draft: S) => {
          if (opt.reducers) opt.reducers[actionName](draft, action)
        })
        storeState = nextState
      } finally {
        isDispatching = false
      }
    }
    const listeners = (currentListeners = nextListeners)
    listeners.forEach(listener => {
      listener()
    })
  }

  function getState(): S {
    if (isDispatching) {
      throw new Error(
        'You may not call store.getState() while the reducer is executing. ' +
          'The reducer has already received the state as an argument. ' +
          'Pass it down from the top reducer instead of reading it from the store.',
      )
    }
    return storeState
  }

  function subscribe(listener: () => any) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.')
    }

    if (isDispatching) {
      throw new Error(
        'You may not call store.subscribe() while the reducer is executing. ' +
          'If you would like to be notified after the store has been updated, subscribe from a ' +
          'component and invoke store.getState() in the callback to access the latest state. ',
      )
    }

    let isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      if (isDispatching) {
        throw new Error(
          'You may not unsubscribe from a store listener while the reducer is executing. ',
        )
      }

      isSubscribed = false

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }

  function replaceReducer(nextReducer: R) {
    if (typeof nextReducer === 'function') {
      throw new Error('Expected the nextReducer to be a function array.')
    }
    opt.reducers = nextReducer
    dispatch({ type: ActionTypes.REPLACE })
  }

  function observable() {
    const outerSubscribe = subscribe
    return {
      subscribe(observer: { next: (arg0: S) => void }) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.')
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState())
          }
        }

        observeState()
        const unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
      },

      [Symbol.observable]() {
        return this
      },
    }
  }

  dispatch({ type: ActionTypes.INIT })

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [Symbol.observable]: observable,
  }
}

export default createStore
export { createStore }
