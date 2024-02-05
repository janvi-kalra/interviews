import {
  ColumnType,
  Columns,
  CellUpdate,
  Row,
  FormulaType,
  ApiType,
} from "./types";
import { ColumnName, runWorkflowForRow } from ".";

let rowData: Row = [
  { val: "" },
  { val: "" },
  { val: "" },
  { val: "" },
  { val: "" },
  { val: "" },
  { val: "" },
];
let initialColumns: Columns = [
  { type: ColumnType.Basic, name: ColumnName.FirstName, deps: [] },
  { type: ColumnType.Basic, name: ColumnName.LastName, deps: [] },
  { type: ColumnType.Basic, name: ColumnName.CompanyName, deps: [] },
  {
    type: ColumnType.Formula,
    name: ColumnName.GoogleSearchInput,
    inputs: {
      type: FormulaType.Concat,
      init: "linkedin.com",
    },
    deps: [ColumnName.FirstName, ColumnName.LastName, ColumnName.CompanyName],
  },
  {
    type: ColumnType.API,
    name: ColumnName.PerformSearch,
    apiType: ApiType.GoogleSearch,
    inputColumnName: ColumnName.GoogleSearchInput,
    deps: [ColumnName.GoogleSearchInput],
  },
  {
    type: ColumnType.Formula,
    name: ColumnName.LinkedinUrl,
    inputs: {
      type: FormulaType.Extract,
      columnName: ColumnName.PerformSearch,
      index: 0,
      field: "url",
    },
    deps: [ColumnName.PerformSearch],
  },
  {
    type: ColumnType.API,
    name: ColumnName.LinkedinData,
    apiType: ApiType.LiProfile,
    inputColumnName: ColumnName.LinkedinUrl,
    deps: [ColumnName.LinkedinUrl],
  },
];

console.log("************* TRIGGER CELL UPDATE 1 *************");
const firstUpdatedCell: CellUpdate = {
  colName: ColumnName.FirstName,
  newCell: { val: "Luna" },
};
rowData = runWorkflowForRow(firstUpdatedCell, rowData, initialColumns);

console.log("************* TRIGGER CELL UPDATE 2 *************");
const secondUpdatedCell: CellUpdate = {
  colName: ColumnName.LastName,
  newCell: { val: "Ruan" },
};
rowData = runWorkflowForRow(secondUpdatedCell, rowData, initialColumns);

console.log("************* TRIGGER CELL UPDATE 3 *************");
const thirdUpdatedCell: CellUpdate = {
  colName: ColumnName.CompanyName,
  newCell: { val: "Clay" },
};
rowData = runWorkflowForRow(thirdUpdatedCell, rowData, initialColumns);
