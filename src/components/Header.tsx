import React from 'react';
import './Header.css';
import EditableCell from './EditableCell';

export default class extends React.Component<IHeader> {
  render() {
    const { partitionKey, sortKey, attributeCount } = this.props;
    return (
      <thead>
        <tr className="header-top">
          <th colSpan={2}>Primary Key</th>
          <th colSpan={attributeCount * 2 + 2}>Data-Item Attributes...</th>
        </tr>
        <tr className="attributeNames">
          <td className="keytitle">Partition Key</td>
          <td className="keytitle">Sort Key</td>
          {Array(attributeCount).fill(0).map((_, i) => (
            <td className="attrTitle" key={`attr${i}`} rowSpan={2} colSpan={2}>Attribute {i + 1}</td>
          ))}
          <td className="attrTitle" colSpan={2} rowSpan={2}>
            ...
          </td>
        </tr>
        <tr className="attributeNames">
          <EditableCell
            className="keyname"
            title={partitionKey.description}
            valueUpdated={() => {}}
          >
            {partitionKey.name}
          </EditableCell>
          <EditableCell
            className="keyname"
            title={partitionKey.description}
            valueUpdated={() => {}}
          >
            {sortKey.name}
          </EditableCell>
        </tr>
      </thead>
    );
  }
}
