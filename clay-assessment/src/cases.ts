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
  { type: ColumnType.Basic, name: ColumnName.FirstName },
  { type: ColumnType.Basic, name: ColumnName.LastName },
  { type: ColumnType.Basic, name: ColumnName.CompanyName },
  {
    type: ColumnType.Formula,
    name: ColumnName.GoogleSearchInput,
    inputs: {
      type: FormulaType.Concat,
      init: "linkedin.com",
    },
  },
  {
    type: ColumnType.API,
    name: ColumnName.PerformSearch,
    apiType: ApiType.GoogleSearch,
    inputColumnName: ColumnName.GoogleSearchInput,
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
  },
  {
    type: ColumnType.API,
    name: ColumnName.LinkedinData,
    apiType: ApiType.LiProfile,
    inputColumnName: ColumnName.LinkedinUrl,
  },
];

const run = async (cellUpdate: CellUpdate) => {
  rowData = await runWorkflowForRow(cellUpdate, rowData, initialColumns);
};

const firstUpdatedCell: CellUpdate = {
  colName: ColumnName.FirstName,
  newCell: { val: "Luna" },
};
run(firstUpdatedCell);

const secondUpdatedCell: CellUpdate = {
  colName: ColumnName.LastName,
  newCell: { val: "Ruan" },
};
run(secondUpdatedCell);

const thirdUpdatedCell: CellUpdate = {
  colName: ColumnName.CompanyName,
  newCell: { val: "Clay" },
};
run(thirdUpdatedCell);
