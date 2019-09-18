import React from 'react';
import './Row.css';
import { IRow } from '../@custom_types/table-types';

interface RowComponent extends IRow {
  onAddAttribute: () => any;
}

const Row: React.FC<RowComponent> = (props) => {
  return (
    <React.Fragment>
      <tr className="top">
        {props.includePartitionKey &&
          <td className="partitionKey" rowSpan={1 + 2 * props.totalRows}>
            {props.partitionKey.value}
          </td>
        }
        <td rowSpan={2}>
          {props.sortKey.value}
        </td>
        {props.attributes.map((attr, i) => (
          <React.Fragment key={`attr${i}`}>
          <td
            key={`attr${i}name`}
            className="attrName"
          >
            {attr.name}
          </td>
            <td
              key={`attr${i}value`}
              className="attrValue"
            >
              {attr.value}
            </td>
          </React.Fragment>
        ))}
        <td className="addAttribute" colSpan={2} rowSpan={2}>
          <button onClick={props.onAddAttribute}>Add Attribute</button>
        </td>
      </tr>
      {props.attributes.length > 0 &&
        <tr className="bottom">
          {props.attributes.map((attr, i) => (
            <td
              key={`attr${i}desc`}
              className="attrDesc"
              colSpan={2}
            >
              {attr.description}
            </td>
          ))}
        </tr>
      }
    </React.Fragment>
  );
}

export default Row;
