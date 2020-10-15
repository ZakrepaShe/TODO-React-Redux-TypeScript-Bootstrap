import * as React from "react";
import AddPanel from "./components/AddPanel";
import ItemsList from "./components/List";
import { Provider } from 'react-redux';
import store from "./Redux/store";

const App: React.FC = () => (
  <Provider store={store}>
    <div className="container">
      <div className="row">
        <div className="col pt-5">
          <div className="row">
            <div className="col">
              <AddPanel/>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <ItemsList/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Provider>
);

export default App;