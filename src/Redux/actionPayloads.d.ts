import { Action } from 'redux-actions';

export type InferValueTypes<T> = T extends { [key: string]: infer U } ? U : never;
type GetActionInnerType<S> = S extends Action<infer T> ? T : never
type UnpackActionTypes<U> = U extends any ? GetActionInnerType<U> : never;

//export type ActionTypes = UnpackActionTypes<ReturnType<InferValueTypes<typeof actions>>>;