import { createAction as createSafeAction } from 'typesafe-actions';
import { createAction } from 'redux-actions';
//Common used actions loose strong action typings :(
import { ADD_LIST_ITEM, REMOVE_LIST_ITEM } from './constants';

export const addFavouriteItemAction = createAction(ADD_LIST_ITEM)

//Exotic typed actions - wtf?
export const removeFavouriteItemSafeAction = createSafeAction(REMOVE_LIST_ITEM, (id) => ({id}))