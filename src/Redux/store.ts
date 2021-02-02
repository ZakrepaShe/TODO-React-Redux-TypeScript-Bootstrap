import { createSelector } from 'reselect';
import * as get from 'lodash.get';
import { TAction, TCGP, TReducer } from './types';
import {
  ADD_LIST_ITEM,
  REDUCER_NAME,
  NOT_TYPED_REDUCER_NAME,
  REMOVE_LIST_ITEM,
  NOT_TYPED_CACHED_REDUCER_NAME,
} from './constants';
import { applyMiddleware, composeEnhancers, createStore } from 'airslate-ts-redux';
import { combineReducers } from 'redux';
import { createCachingReducer, createTypedCachingReducer, innerInitialState } from './cachingReducerCore';

// One of store typings
type item = {
  id: string,
  title: string,
}
type itemsList = item[]
type TListState = {
  list: itemsList,
  lastId: number,
}
const listState: TListState = {
  list: [],
  lastId: 0
};

// All store typings
export interface IStoreState {
  [REDUCER_NAME]: TListState,
  [NOT_TYPED_REDUCER_NAME]: any
  [NOT_TYPED_CACHED_REDUCER_NAME]: any
}
//All store initial state
export const initialState: IStoreState = {
  [REDUCER_NAME]: listState,
  [NOT_TYPED_REDUCER_NAME]: [],
  [NOT_TYPED_CACHED_REDUCER_NAME]: {},
}

export const todoReducer: TReducer<TListState> = (
  state = listState,
  action
) => {
  switch (action.type) {
    case REMOVE_LIST_ITEM:
      return ({
        ...state,
        list: state.list.filter(item => item.id !== action.id),
      });

    case ADD_LIST_ITEM:
      return ({
        ...state,
        list: [
          ...state.list,
          {id: `${state.lastId + 1}`, title: action.title},
        ],
        lastId: state.lastId + 1,
      });

    default:
      return state;
  }
};

//Favourites list (work in progress)
export const notTypedReducer = (
  state= [],
  action
) => {
  switch (action.type) {
    case 'NOT_TYPED_ADD_ACTION':
      return state.concat(action.id);

    case 'NOT_TYPED_REMOVE_ACTION':
      return state.filter(action.id);

    default:
      return state;
  }
};


export const UPDATE_SLATES_ADDONS = 'AD@SLATE_ADDONS/UPDATE_SLATES_ADDONS';
export const SET_SLATES_ADDONS = 'AD@SLATE_ADDONS/SET_SLATES_ADDONS';
export const SET_SLATE_ADD_ON = 'AD@SLATE_ADDONS/SET_SLATE_ADD_ON';
export const SET_SLATE_ADD_ON_META_BY_ID = 'AD@SLATE_ADDONS/SET_SLATE_ADD_ON_META_BY_ID';
export const REMOVE_SLATE_ADD_ON = 'AD@SLATE_ADDONS/REMOVE_SLATE_ADD_ON';
export const UPGRADE_SLATE_ADDONS = 'AD@SLATE_ADDONS/UPGRADE_SLATE_ADDONS';
const notTypedCreateCachingReducerInitialState = {};

const notTypedCreateCachingReducer = createCachingReducer({
  SET_LIST: SET_SLATES_ADDONS,
  SET_ENTITY: SET_SLATE_ADD_ON,
  REMOVE_ENTITY: REMOVE_SLATE_ADD_ON,
  BULK_UPDATE: UPDATE_SLATES_ADDONS,
  UPDATE_ENTITY: SET_SLATE_ADD_ON_META_BY_ID,
  ADD_ENTITIES: UPGRADE_SLATE_ADDONS,
}, {}, notTypedCreateCachingReducerInitialState);

const typedCreateCachingReducer: TReducer<typeof innerInitialState> = (state = innerInitialState, action) => createTypedCachingReducer({
  SET_LIST: SET_SLATES_ADDONS,
  SET_ENTITY: SET_SLATE_ADD_ON,
  REMOVE_ENTITY: REMOVE_SLATE_ADD_ON,
  BULK_UPDATE: UPDATE_SLATES_ADDONS,
  UPDATE_ENTITY: SET_SLATE_ADD_ON_META_BY_ID,
  ADD_ENTITIES: UPGRADE_SLATE_ADDONS,
}, (handleDefault) => {
  switch (action.type) {
    case '@ADD_LIST_ITEM':
      return state.concat(action.title);

    case 'NOT_TYPED_REMOVE_ACTION':
      return state.filter(action.id);

    default:
      return handleDefault(state, action);
  }
});



const reducers = {
  todoReducer,
  notTypedReducer,
  notTypedCreateCachingReducer,
}
const middlewares = [require('redux-logger').createLogger({ collapsed: true })];

export default createStore<TCGP>(
  combineReducers<IStoreState, TAction>(reducers),
  initialState,
  composeEnhancers<TCGP>(applyMiddleware(...middlewares)),
);


export const stateSelector = (state: IStoreState): TListState => get(state, REDUCER_NAME);
export const todoListSelector = createSelector(stateSelector, (state): itemsList => get(state, 'list'));

