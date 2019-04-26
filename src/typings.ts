import * as React from 'react'

export interface Opt<S, R, E> {
  name?: string
  state: S
  reducers?: R
  effects?: E
}

export interface Updater<S> {
  update: (set: any, nextState: S) => any
  set: any
}

export type beforeDispatchFunc = <S, R, P extends any>(state: S, action: R, payload?: P) => void

export type afterDispatchFunc = <S, R, P extends any>(state: S, action: R, payload?: P) => void

export type beforeUpdateFunc = <S, R, P extends any>(
  prevState: S,
  nextState: S,
  action: R,
  payload?: P,
) => void

export type ActionSelector<R, E> = (action: R & E) => any

export type ActFn<R> = (action: R, payload?: any) => void

export type Selector<S, P> = (state: S) => P
export type RenderFn<P> = (partialState: P) => React.ReactNode

export interface Reducers<S> {
  [key: string]: ReducerFn<S>
}

export type ReducerFn<S> = (state: S, payload?: any) => S | void

export interface Effects {
  [key: string]: EffectFn
}
export type EffectFn = (payload: any) => any

export interface Result<T> {
  loading: boolean
  data: T
  error: any
}

export interface Variables {
  [key: string]: any
}

export interface Config {
  beforeDispatchs: beforeDispatchFunc[]
  afterDispatchs: afterDispatchFunc[]
  beforeUpdates: beforeUpdateFunc[]
}
