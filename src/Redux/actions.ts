import { ADD_LIST_ITEM, REMOVE_LIST_ITEM } from './constants';
import { createAction as createSafeAction } from 'typesafe-actions';
import { createAction } from 'redux-actions';

//New fancy type style
export type IAddListItem = ReturnType<typeof addListItemAction>;
export const addListItemAction = (title: string) => ({
  type: ADD_LIST_ITEM,
  title,
});

export interface IRemoveListItem extends ReturnType<typeof removeListItemAction> {}
export const removeListItemAction = (id: string) => ({
  type: REMOVE_LIST_ITEM,
  id,
});


//Common used actions loose strong action typings :(
// export type IaddFavouriteItemAction = ReturnType<typeof addFavouriteItemAction>;
// export const addFavouriteItemAction = createAction(ADD_LIST_ITEM)

//Exotic typed actions - wtf?
//export const removeFavouriteItemSafeAction = createSafeAction(REMOVE_LIST_ITEM, (id) => ({id}))
