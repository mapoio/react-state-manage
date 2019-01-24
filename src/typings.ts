import * as React from 'react'

export interface Opt<S, R, E> {
  name?: string
  state: S
  reducers?: R
  effects?: E
}

export interface Updater<S> {
  update: (set: any, reducer: ReducerFn<S>, action: ActionType) => any
  set: any
}

export type ActionSelector<R, E> = (reducer: R & E) => any

export type ActFn<R> = (reducer: R, action?: ActionType) => void

export type Selector<S, P> = (state: S) => P
export type RenderFn<P> = (partialState: P) => React.ReactNode

export interface Action<Type, Payload, Meta> {
  type: Type
  payload?: Payload
  error?: boolean
  meta?: Meta
}

export type ActionPayloadMeta<T, K> = Action<any, T, K>
export type ActionPayload<T> = Action<any, T, any>
export type ActionMeta<T> = Action<any, any, T>
export type ActionType = Action<any, any, any>

export interface Reducers<S> {
  [key: string]: ReducerFn<S>
}

export type ReducerFn<S> = (state: S, action: ActionType) => S | void

export interface Effects {
  [key: string]: EffectFn
}
export type EffectFn = (action: ActionType) => any

export interface Result<T> {
  loading: boolean
  data: T
  error: any
}

export interface Variables {
  [key: string]: any
}

export interface Config {
  graphql: {
    endpoint: string
    headers: {
      [key: string]: string
    }
  }
}

export type Func = (...args: any) => any

export interface Store {
  getState: () => any
  dispatch: (action: ActionType | Func | object) => any
}

export type Next<K> = (next: ActFn<K>) => (action: ActionType | Func | object) => any

export type Middleware = (store: Store) => Next<any>
