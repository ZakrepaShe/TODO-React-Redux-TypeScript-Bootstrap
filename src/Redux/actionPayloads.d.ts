import { Action } from 'redux-actions';

interface BaseItem {
  id: string
}

export interface RemoveListItemActionPayload extends BaseItem {}

export interface AddListItemActionPayload {
  title: string,
}





type InferValueTypes<T> = T extends { [key: string]: infer U } ? U : never;
type GetActionInnerType<S> = S extends Action<infer T> ? T : never
type UnpackActionTypes<U> = U extends any ? GetActionInnerType<U> : never;