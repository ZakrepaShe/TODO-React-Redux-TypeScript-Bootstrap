import * as React from "react";
import { useCallback } from "react";


interface ItemProps { title: string, removeItem: any, id: string }

const Item: React.ElementType<ItemProps> = ({ title, removeItem, id }) => {
  const handleRemove = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    removeItem();
  }, [removeItem]);

  return (
    <li className="list-group-item">
      <div className="row justify-content-between align-items-center">
        <div className="col">
          {id}
          {'. '}
          {title}
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-secondary" type="button" onClick={handleRemove}>Remove</button>
        </div>
      </div>
    </li>
  );
};

export default Item;