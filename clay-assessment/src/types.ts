import { ColumnName } from ".";

export enum FormulaType {
  Concat = "Concat",
  Extract = "Extract",
}
interface Formula<T extends FormulaType> {
  type: T;
}
interface ConcatFormula extends Formula<FormulaType.Concat> {
  init: string;
}
interface ExtractFormula extends Formula<FormulaType.Extract> {
  field: string;
  index: number;
  columnName: ColumnName;
}

export enum ColumnType {
  Basic = "Basic",
  Formula = "Formula",
  API = "API",
}
interface Column<T extends ColumnType> {
  type: T;
  name: ColumnName;
  // The value of the cells in this column are dependent on all columns listed here.
  // In a row, if any of the columns in dep change, we must update this column as well.
  deps: ColumnName[];
}
export interface BasicColumn extends Column<ColumnType.Basic> {}
export interface FormulaColumn extends Column<ColumnType.Formula> {
  inputs: ConcatFormula | ExtractFormula;
}

export enum ApiType {
  GoogleSearch = "GoogleSearch",
  LiProfile = "LiProfile",
}

export interface ApiColumn extends Column<ColumnType.API> {
  apiType: ApiType;
  inputColumnName: ColumnName;
}

export type Columns = (BasicColumn | FormulaColumn | ApiColumn)[];

export type Cell = {
  val: string;
  apiData?: any[]; // Problem does not define the structure of the data.
};

export type Row = Cell[];
export type CellUpdate = {
  colName: ColumnName;
  newCell: Cell;
};
