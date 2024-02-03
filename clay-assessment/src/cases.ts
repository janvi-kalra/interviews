import {
  ColumnType,
  Columns,
  CellUpdate,
  Row,
  FormulaType,
  ApiType,
} from "./types";
import { runWorkflowForRow } from ".";

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
  { type: ColumnType.Basic, name: "First Name" },
  { type: ColumnType.Basic, name: "Last Name" },
  { type: ColumnType.Basic, name: "Company Name" },
  {
    type: ColumnType.Formula,
    name: "Google Search Input",
    inputs: {
      type: FormulaType.Concat,
      init: "linkedin.com",
    },
  },
  {
    type: ColumnType.API,
    name: "Perform Search",
    apiType: ApiType.GoogleSearch,
    inputColumnName: "Google Search Input",
  },
  {
    type: ColumnType.Formula,
    name: "Linkedin URL",
    inputs: {
      type: FormulaType.Extract,
      columnName: "Perform Search",
      index: 0,
      field: "url",
    },
  },
  {
    type: ColumnType.API,
    name: "Linkedin Data",
    apiType: ApiType.LiProfile,
    inputColumnName: "Linkedin URL",
  },
];

const run = async (cellUpdate: CellUpdate) => {
  rowData = await runWorkflowForRow(cellUpdate, rowData, initialColumns);
};

const firstUpdatedCell: CellUpdate = {
  colName: "First Name",
  newCell: { val: "Luna" },
};
run(firstUpdatedCell);

const secondUpdatedCell: CellUpdate = {
  colName: "Last Name",
  newCell: { val: "Ruan" },
};
run(secondUpdatedCell);

const thirdUpdatedCell: CellUpdate = {
  colName: "Company Name",
  newCell: { val: "Clay" },
};
run(thirdUpdatedCell);
