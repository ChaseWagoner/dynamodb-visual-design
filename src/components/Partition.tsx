import React from 'react';
import Row from './Row';
import './Partition.css';
import { IPartition } from '../@custom_types/table-types';

interface PartitionComponent extends IPartition {
  attributeCount: number;
  onAddRow: () => any;
  onAddRowAttribute: (rowId: any) => any;
}

const Partition: React.FC<PartitionComponent> = (props) => {
  return (
    <tbody>
      {props.rows.map((row, i) => (
        <Row
          key={`row${i}`}
          includePartitionKey={i === 0}
          totalRows={props.rows.length}
          partitionKey={props.partitionKey}
          sortKey={row.sortKey}
          attributes={row.attributes}
          onAddAttribute={props.onAddRowAttribute.bind(null, i)}
        />
      ))}
      <tr>
        <td colSpan={3 + 2 * props.attributeCount}>
          <button onClick={props.onAddRow}>Add Row</button>
        </td>
      </tr>
    </tbody>
  );
}

export default Partition;
