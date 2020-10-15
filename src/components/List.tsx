import * as React from 'react';
import { useCallback } from 'react';
import Item from './Item';
import { Dispatch } from 'redux';
import { initialState, todoListSelector, actions, ActionTypes } from '../Redux/store';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: initialState) => ({
  list: todoListSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  removeListItem: (id: string) => dispatch(actions.removeListItemAction(id)),
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export type ItemsListProps = ConnectedProps<typeof connector>;

const ItemsList: React.ElementType<ItemsListProps> = ({ list, removeListItem}) => {
  const handleRemove = useCallback((id: string) => () => {
    removeListItem(id);
  }, [removeListItem]);

  return (
    <ul className="list-group">
      {list.map(({id, title}) => (
        <Item key={id} title={title} id={id} removeItem={handleRemove(id)}/>
      ))}
    </ul>
  );
};


export default connector(ItemsList);