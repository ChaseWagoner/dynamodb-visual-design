import { State } from "../reducers";
import { ITableInput, IPartition, IPartitionRow, IAttributeCell } from '../@custom_types/table-types';

export enum ActionType {
  IMPORT_STATE,
  TABLE_ADD,
  TABLE_DELETE,
  TABLE_PARTITION_ADD,
  TABLE_PARTITION_DELETE,
  TABLE_PARTITION_ROW_ADD,
  TABLE_PARTITION_ROW_DELETE,
  TABLE_PARTITION_ROW_ATTRIBUTE_ADD,
  TABLE_PARTITION_ROW_ATTRIBUTE_DELETE,
};

export type AnyAction = SelectorAction | StateAction;

export interface SelectorAction {
  type: ActionType;
  selector: BaseSelector | TableSelector | PartitionSelector | PartitionRowSelector | PartitionRowAttributeSelector;
};

export interface AddAction extends SelectorAction {
  input: any;
}

export interface StateAction {
  type: ActionType.IMPORT_STATE;
  state: State;
}

interface BaseSelector {}

export interface TableSelector extends BaseSelector {
  table: number;
}

export interface PartitionSelector extends TableSelector {
  partition: number;
}

export interface PartitionRowSelector extends PartitionSelector {
  row: number;
}

export interface PartitionRowAttributeSelector extends PartitionRowSelector {
  attribute: number;
}

interface AppThing<TAdd, TDelete> {
  add: TAdd;
  delete: TDelete;
}

export interface AppShape<TState, TAdd, TSelect> {
  importState: TState;

  table: AppThing<TAdd, TSelect> & {
    partition: AppThing<TAdd, TSelect> & {
      row: AppThing<TAdd, TSelect> & {
        attribute: AppThing<TAdd, TSelect>;
      };
    };
  };
}

// TODO: reimagine all types
type StateCreator = (...args: any[]) => StateAction;
type AddCreator = (...args: any[]) => AddAction;
type SelectorCreator = (...args: any[]) => SelectorAction;

const Actions: AppShape<StateCreator, AddCreator, SelectorCreator> = {
  importState: (state: State): StateAction => ({
    type: ActionType.IMPORT_STATE,
    state,
  }),

  table: {
    add: (input: ITableInput) => ({
      type: ActionType.TABLE_ADD,
      selector: {} as BaseSelector,
      input,
    }),
    delete: (selector: TableSelector) => ({
      type: ActionType.TABLE_DELETE,
      selector,
    }),

    partition: {
      add: (selector: TableSelector, input: IPartition) => ({
        type: ActionType.TABLE_PARTITION_ADD,
        selector,
        input,
      }),
      delete: (selector: PartitionRowSelector) => ({
        type: ActionType.TABLE_PARTITION_DELETE,
        selector,
      }),

      row: {
        add: (selector: PartitionSelector, input: IPartitionRow) => ({
          type: ActionType.TABLE_PARTITION_ROW_ADD,
          selector,
          input,
        }),
        delete: (selector: PartitionRowSelector) => ({
          type: ActionType.TABLE_PARTITION_ROW_ADD,
          selector,
        }),

        attribute: {
          add: (selector: PartitionRowSelector, input: IAttributeCell) => ({
            type: ActionType.TABLE_PARTITION_ROW_ATTRIBUTE_ADD,
            selector,
            input,
          }),
          delete: (selector: PartitionRowAttributeSelector) => ({
            type: ActionType.TABLE_PARTITION_ROW_ATTRIBUTE_ADD,
            selector,
          }),
        },
      },
    },
  },
};

export default Actions;
