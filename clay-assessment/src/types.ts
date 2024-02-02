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
  array: any[]; // Don't have enough information to know what type this is.
}

export enum ColumnType {
  Basic = "Basic",
  Formula = "Formula",
  API = "API",
}
interface Column<T extends ColumnType> {
  type: T;
  name: string;
}
interface BasicColumn extends Column<ColumnType.Basic> {}
export interface FormulaColumn extends Column<ColumnType.Formula> {
  inputs: ConcatFormula | ExtractFormula;
}

export enum ApiType {
  GoogleSearch = "GoogleSearch",
  LiProfile = "LiProfile",
}

export interface ApiColumn extends Column<ColumnType.API> {
  apiType: ApiType;
  inputFromColumn: Column<ColumnType.Basic | ColumnType.Formula>;
}

export type Columns = (BasicColumn | FormulaColumn | ApiColumn)[];

export type Cell = {
  val: string;
  apiData?: any[]; // Problem does not define the structure of the data.
};

export type Row = Cell[];
export type CellUpdate = {
  colName: string;
  newCell: Cell;
};
