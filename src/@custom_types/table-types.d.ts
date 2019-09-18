export interface ITableInput {
  partitionKey: IKeyDescriptor;
  sortKey: IKeyDescriptor;
  partitions: IPartition[];
}

export interface ITable extends ITableInput {
  table: any;
}

export interface IHeader {
  partitionKey: IKeyDescriptor;
  sortKey: IKeyDescriptor;
  attributeCount: number;
}

export interface IKeyDescriptor {
  name: string;
  format: string;
  description: string;
}

export interface IPartition {
  partitionKey: IKeyCell;
  rows: IPartitionRow[];
}

export interface IPartitionRow {
  sortKey: IKeyCell;
  attributes: IAttributeCell[];
}

export interface IRow {
  includePartitionKey: boolean;
  totalRows: number;
  partitionKey: IKeyCell;
  sortKey: IKeyCell;
  attributes: IAttributeCell[];
}

export interface IAttributeCell {
  name: string;
  format: string;
  value: string;
  description: string;
}

export interface IKeyCell extends IAttributeCell { }
