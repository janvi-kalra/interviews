import { printTable } from "console-table-printer";

type Columns = {};
type Cell = {};
type Row = {};
type CellUpdate = {};

function runWorkflowForRow(
  updatedCell: CellUpdate,
  rowData: Row,
  columns: Columns
): Row {
  // ... implementation

  refreshUI(newRowData);
  return newRowData;
}

function refreshUI(rowData) {
  // print out the values displayed in the row;
}

let rowData = null; // define rowData here;
const initialColumns = null; // define columns here

const firstUpdatedCell = null; // update to cell in column "First Name"
rowData = runWorkflowForRow(firstUpdatedCell, rowData, initialColumns);

const secondUpdatedCell = null; // update to cell in column "Last Name"
rowData = runWorkflowForRow(secondUpdatedCell, rowData, initialColumns);

const thirdUpdatedCell = null; // update to cell in column "Company Name"
runWorkflowForRow(thirdUpdatedCell, rowData, initialColumns);
