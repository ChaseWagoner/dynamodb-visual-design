import React from 'react';
import { connect } from 'react-redux';
import './Table.css';
import Header from './Header';
import Partition from './Partition';
import actions from '../actions';
import { State } from '../reducers';
import { IAttributeCell, IPartitionRow, IPartition, ITable } from '../@custom_types/table-types';

const mockAttribute: IAttributeCell = {
  name: 'new attribute',
  description: 'attribute',
  format: 'format',
  value: 'example',
};

const mockRow: IPartitionRow = {
  sortKey: {
    name: 'key name',
    description: 'sort key',
    format: 'format',
    value: 'example',
  },
  attributes: [mockAttribute],
};

const mockPartition: IPartition = {
  partitionKey: {
    name: 'key name',
    description: 'partition key',
    format: 'format',
    value: 'example',
  },
  rows: [mockRow],
};

interface ITableComponentProps extends ITable {
  // TODO: get real type
  dispatch: (...args: any[]) => any,
}

export class Table extends React.Component<ITableComponentProps, ITable> {
  constructor(props: ITableComponentProps) {
    super(props);

    this.addPartition = this.addPartition.bind(this);
  }

  addPartition() {
    this.props.dispatch(actions.table.partition.add({
      table: this.props.table,
    }, mockPartition));
  }

  addPartitionRow(partition: number) {
    this.props.dispatch(actions.table.partition.row.add({
      table: this.props.table,
      partition,
    }, mockRow));
  }

  addPartitionRowAttribute(partition: number, row: number) {
    this.props.dispatch(actions.table.partition.row.attribute.add({
      table: this.props.table,
      partition,
      row,
    }, mockAttribute));
  }

  render() {
    const {partitionKey, sortKey, partitions} = this.props;
    const attributeCount = Math.max(...partitions.map(p => Math.max(...p.rows.map(r => r.attributes.length))));

    return (
      <table cellPadding={5} cellSpacing={0}>
        <Header
          partitionKey={partitionKey}
          sortKey={sortKey}
          attributeCount={attributeCount}
        />
        {partitions.map((partition, i) => (
          <Partition
            key={`partition${i}`}
            partitionKey={partition.partitionKey}
            rows={partition.rows}
            attributeCount={attributeCount}
            onAddRow={this.addPartitionRow.bind(this, i)}
            onAddRowAttribute={this.addPartitionRowAttribute.bind(this, i)}
          />
        ))}
        <tbody>
          <tr>
            <td colSpan={3 + 2 * attributeCount}>
              <button onClick={this.addPartition}>Add Partition</button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state: State, ownProps: ITable) => {
  return state.tables[ownProps.table] || {
    partitionKey: ownProps.partitionKey,
    sortKey: ownProps.sortKey,
    partitions: ownProps.partitions,
  };
};

export default connect(mapStateToProps)(Table);
