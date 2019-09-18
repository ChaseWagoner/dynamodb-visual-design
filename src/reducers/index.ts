import { AppShape, ActionType, SelectorAction, AddAction, TableSelector, PartitionSelector, PartitionRowSelector, StateAction } from '../actions';
import defaultState from './defaultState';
import { Reducer } from "redux";
import { ITableInput, IPartition, IPartitionRow } from '../@custom_types/table-types';

export interface State {
  tables: ITableInput[];
}

type StateHandler = (state: State) => State;
type AddHandler = (state: State, action: AddAction) => State;
type SelectHandler = (state: State, action: SelectorAction) => State;

const replaceArrayElement = <T>(arr: T[], i: number, el: T) => {
  return [...arr.slice(0, i), el, ...arr.slice(i + 1)];
};

const removeArrayElement = (arr: any[], i: number) => {
  return [...arr.slice(0, i), ...arr.slice(i + 1)];
};

const addArrayElement = <T>(arr: T[], el: T) => {
  return [...arr, el];
};

const reducers: AppShape<StateHandler, AddHandler, SelectHandler> = {
  importState: (state) => state,

  table: {
    add: (state, action: AddAction) => {
      return {
        ...state,
        tables: addArrayElement(state.tables, action.input),
      };
    },
    delete: (state, action: SelectorAction) => {
      return {
        ...state,
        tables: removeArrayElement(state.tables, (action.selector as TableSelector).table),
      };
    },

    partition: {
      add: (state, action) => {
        const { table: tableI } = action.selector as TableSelector;
        const table = state.tables[tableI];

        return replaceTable(state, tableI, {
          ...table,
          partitions: addArrayElement(table.partitions, action.input),
        });
      },
      delete: (state, action) => {
        const { table: tableI, partition: partitionI } = action.selector as PartitionSelector;
        const table = state.tables[tableI];

        return replaceTable(state, tableI, {
          ...table,
          partitions: removeArrayElement(table.partitions, partitionI),
        });
      },

      row: {
        add: (state, action) => {
          const { table: tableI, partition: partitionI } = action.selector as PartitionSelector;
          const table = state.tables[tableI];
          const partition = table.partitions[partitionI];

          return replaceTable(state, tableI, {
            ...table,
            partitions: replaceArrayElement(table.partitions, partitionI, {
              ...partition,
              rows: addArrayElement(partition.rows, action.input),
            }),
          });
        },
        delete: (state, action) => {
          return {
            ...state,
          };
        },

        attribute: {
          add: (state, action) => {
            const { table: tableI, partition: partitionI, row: rowI } = action.selector as PartitionRowSelector;
            const table = state.tables[tableI];
            const partition = table.partitions[partitionI];
            const row = partition.rows[rowI];

            return replaceTable(
              state,
              tableI,
              replacePartition(table, partitionI,
                replacePartitionRow(partition, rowI, {
                  ...partition.rows[rowI],
                  attributes: addArrayElement(row.attributes, action.input),
                })
              )
            );
          },
          delete: (state, action) => {
            return {
              ...state,
            };
          },
        },
      },
    },
  },
};

const replaceTable = (state: State, i: number, table: ITableInput): State => {
  return {
    ...state,
    tables: replaceArrayElement(state.tables, i, table),
  };
};

const replacePartition = (table: ITableInput, i: number, partition: IPartition): ITableInput => {
  return {
    ...table,
    partitions: replaceArrayElement(table.partitions, i, partition),
  };
};

const replacePartitionRow = (partition: IPartition, i: number, row: IPartitionRow): IPartition => {
  return {
    ...partition,
    rows: replaceArrayElement(partition.rows, i, row),
  };
};

const root: Reducer<State, StateAction | SelectorAction | AddAction> = (state = defaultState, action) => {
  switch (action.type) {
    case ActionType.IMPORT_STATE: {
      return reducers.importState((action as StateAction).state);
    }

    case ActionType.TABLE_ADD: {
      return reducers.table.add(state, action as AddAction);
    }

    case ActionType.TABLE_DELETE: {
      return reducers.table.delete(state, action as SelectorAction);
    }

    case ActionType.TABLE_PARTITION_ADD: {
      return reducers.table.partition.add(state, action as AddAction);
    }

    case ActionType.TABLE_PARTITION_ROW_ADD: {
      return reducers.table.partition.row.add(state, action as AddAction);
    }

    case ActionType.TABLE_PARTITION_ROW_ATTRIBUTE_ADD: {
      return reducers.table.partition.row.attribute.add(state, action as AddAction);
    }

    default:
      return state;
  }
};

export default root;
