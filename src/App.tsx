import React from 'react';
import { configureStore } from 'redux-starter-kit';
import './App.css';
import Table from './components/Table';
import rootReducer from './reducers';
import { Provider } from 'react-redux';
import actions from './actions';

const store = configureStore({
  reducer: rootReducer,
});

const prepareDownload: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store.getState()));
  (e.target as HTMLAnchorElement).setAttribute("href", dataStr);
};

const upload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  if (e.target.files && e.target.files.length) {
    const file = e.target.files[0] as File;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const state = JSON.parse((loadEvent.target as FileReader).result as string);
        // TODO: check for valid format, not just JSON
        store.dispatch(actions.importState(state));
      } catch (e) {
        alert('Failed to read file. Check console for error.');
        console.error('Failed to parse file.', e);
      }
    };
    reader.readAsText(file);
  }
  // TODO: else, file removed (do nothing)?
};

export default class App extends React.Component {
  render() {
    const state = store.getState();

    return (
      <React.Fragment>
        <label>
          Upload JSON:
          <input
            id="up"
            type="file"
            accept="application/json"
            onChange={upload}
          />
        </label>
        <br/>
        <a
          id="down"
          href=""
          onClick={prepareDownload}
          download="state.json"
        >
          Download current state
        </a>
        <Provider store={store}>
          {Object.values(state.tables).map((table, i) => {
            return (
              <Table
                key={`table-${i}`}
                table={i}
                partitionKey={table.partitionKey}
                sortKey={table.sortKey}
                partitions={table.partitions}
                dispatch={store.dispatch.bind(store)}
              />
            );
          })}
        </Provider>
      </React.Fragment>
    );
  }
}
