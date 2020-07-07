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

export default class App extends React.Component {
  getUploader() {
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

    return upload;
  }

  getDownloadPreparer(type: 'ts' | 'json') {
    const downloadPreparer: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
      let storeState = store.getState();
      let state: string;

      if (type === 'json') {
        state = JSON.stringify(storeState);
      } else {
        state = `
  const state: State = {};


  export default state;
  `
      }

      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store.getState()));
      (e.target as HTMLAnchorElement).setAttribute("href", dataStr);
    }

    return downloadPreparer;
  }

  getProjectNameUpdater() {
    const updater: React.FormEventHandler<HTMLInputElement> = (e) => {
      store.dispatch(actions.updateProjectName(store.getState(), (e.target as HTMLInputElement).value));
    };

    return updater;
  }

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
            onChange={this.getUploader()}
          />
        </label>
        <br />
        <a
          id="down-json"
          href=""
          onClick={this.getDownloadPreparer('json')}
          download="state.json"
        >
          Download current state (JSON)
        </a>
        <a
          id="down-ts"
          href=""
          onClick={this.getDownloadPreparer('ts')}
          download="state.ts"
        >
          Download current state (JSON)
        </a>
        <Provider store={store}>
          <input defaultValue={state.projectName} onInput={this.getProjectNameUpdater()} />
          {Object.values(state.tables).map((table, i) => {
            return (
              <Table
                key={`table-${i}`}
                table={i}
                partitionKey={table.partitionKey}
                sortKey={table.sortKey}
                partitions={table.partitions}
              />
            );
          })}
        </Provider>
      </React.Fragment>
    );
  }
}
