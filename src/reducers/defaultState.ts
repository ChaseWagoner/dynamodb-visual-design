import { State } from ".";
import { IKeyCell, IPartition } from "../@custom_types/table-types";

const partitionKey: IKeyCell = {
  name: 'PK',
  format: 'pkformat',
  description: '$corpId and product abbreviation',
  value: '$corpId_CAND_MSG',
};
const sortKey: IKeyCell = {
  name: 'SK',
  format: 'skformat',
  description: 'the sk',
  value: 'SK1_2',
};

const partitions: IPartition[] = [
  {
    partitionKey,
    rows: [
      {
        sortKey,
        attributes: [
          {
            name: 'testattr',
            format: 'attr',
            description: 'the attribute',
            value: 'something',
          },
          {
            name: 'candidate ID',
            description: 'candidate user ID',
            format: 'UUID probably',
            value: '1',
          },
          {
            name: 'sender ID',
            description: 'hiring manager user ID',
            format: 'UUID probably',
            value: 'CSOD123',
          },
        ],
      },
      {
        sortKey: Object.assign({}, sortKey, { value: 'SK1_3' }),
        attributes: [
          {
            name: 'testattr2',
            format: 'attr',
            description: 'the other attribute',
            value: 'something else',
          },
          {
            name: 'testattr3',
            format: 'attr',
            description: 'yet another attribute',
            value: 'something entirely different',
          },
        ],
      },
    ],
  },
];

const defaultState: State = {
  tables: [{
    partitionKey,
    sortKey,
    partitions,
  }],
};

export default defaultState;
