import { Action, createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { createStore, combineReducers } from 'redux';
import * as get from 'lodash.get';
import { AddListItemActionPayload, RemoveListItemActionPayload } from './actionPayloads';
import { InferValueTypes, UnpackActionTypes } from './actionPayloads';


const REMOVE_LIST_ITEM = '@REMOVE_LIST_ITEM';
const ADD_LIST_ITEM = '@ADD_LIST_ITEM';


export const actions = {
  addListItemAction: createAction<AddListItemActionPayload, string>
  (ADD_LIST_ITEM, (title) => ({title})),
  removeListItemAction: createAction<RemoveListItemActionPayload, string>
  (REMOVE_LIST_ITEM, (id) => ({id})),
};

export type ActionTypes = UnpackActionTypes<ReturnType<InferValueTypes<typeof actions>>>;

const REDUCER_NAME = 'todoReducer';

type item = {
  id: string,
  title: string,
}

type itemsList = item[]

export type listState = {
  list: itemsList,
  lastId: number,
}

export interface initialState {
  [REDUCER_NAME]: listState
}

const listState = {
  list: [],
  lastId: 0
};


const todoReducer = handleActions<listState, ActionTypes>({
  [REMOVE_LIST_ITEM]: (
    state,
    {payload: {id}}: Action<RemoveListItemActionPayload>,
  ): listState => ({
    ...state,
    list: state.list.filter(item => item.id !== id),
  }),
  [ADD_LIST_ITEM]: (
    state,
    {payload: {title}}: Action<AddListItemActionPayload>,
  ): listState => ({
    ...state,
    list: [
      ...state.list,
      {id: `${state.lastId + 1}`, title},
      ],
    lastId: state.lastId + 1,
  }),
}, listState);

export default createStore(
  combineReducers({[REDUCER_NAME]: todoReducer}),
  {},
  (global as any).__REDUX_DEVTOOLS_EXTENSION__ && (global as any).__REDUX_DEVTOOLS_EXTENSION__(),
);

export const stateSelector = (state: initialState): listState => get(state, REDUCER_NAME);

export const todoListSelector = createSelector(stateSelector, (state): itemsList => get(state, 'list'));

