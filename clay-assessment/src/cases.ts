import { ColumnType, Columns, CellUpdate, Row, FormulaType } from "./types";
import { runWorkflowForRow } from ".";

let rowData: Row = [{ val: "" }, { val: "" }, { val: "" }, { val: "" }];
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
];

const firstUpdatedCell: CellUpdate = {
  colName: "First Name",
  newCell: { val: "Luna" },
};
rowData = runWorkflowForRow(firstUpdatedCell, rowData, initialColumns);

const secondUpdatedCell: CellUpdate = {
  colName: "Last Name",
  newCell: { val: "Ruan" },
};
rowData = runWorkflowForRow(secondUpdatedCell, rowData, initialColumns);

const thirdUpdatedCell: CellUpdate = {
  colName: "Company Name",
  newCell: { val: "Clay" },
};

runWorkflowForRow(thirdUpdatedCell, rowData, initialColumns);
