import * as React from "react";
import { useCallback, useRef, useState } from 'react';
import { Dispatch } from 'redux';
import { actions } from '../Redux/store';
import { connect, ConnectedProps } from 'react-redux';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addListItem: (title: string) => dispatch(actions.addListItemAction(title)),
});

const connector = connect(
  null,
  mapDispatchToProps,
);

export type AddPanelProps = ConnectedProps<typeof connector>;

const AddPanel: React.ElementType<AddPanelProps> = ({addListItem}) => {
  const [title, changeTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = useCallback((event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event?.preventDefault();
    if(title.trim().length === 0) return;
    addListItem(title);
    changeTitle('');
    inputRef.current.focus()
  }, [addListItem, title]);



  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    changeTitle(event.currentTarget.value)
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // On Enter
    if (event.keyCode === 13){
      handleAdd()
    }
  };

  return (
    <div className="input-group mb-3">
      <input
        ref={inputRef}
        type="text"
        className="form-control"
        placeholder="Recipient's username"
        aria-label="Recipient's username"
        aria-describedby="button-addon2"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={title}
      />
      <div className="input-group-append">
        <button className="btn btn-outline-primary" onClick={handleAdd} type="button">Add</button>
      </div>
    </div>
  );
};

export default connector(AddPanel);