import compose from './compose'
import { createStore } from './createStore'

import {
  Opt,
  Reducers,
  Effects,
  ActionSelector,
  Middleware,
  ActionType,
  Action,
  Func,
} from './typings'

export default function createStoreFactory(...middlewares: Middleware[]) {
  return <S, R extends Reducers<S>, E extends Effects>(opt: Opt<S, R, E>) => {
    const store = createStore(opt)
    let dispatch: <K extends any>(
      action: Action<keyof (R & E) | ActionSelector<R, E>, K, any> | object | Func,
    ) => any
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action: ActionType | object | Func) => dispatch(action),
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return { ...store, dispatch }
  }
}

export { createStoreFactory }
