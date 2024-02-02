import { printTable } from "console-table-printer";

type Columns = string[];

type Cell = string;

type Row = Cell[];

type CellUpdate = {
  colName: string;
  newCell: Cell;
};

function runWorkflowForRow(
  updatedCell: CellUpdate,
  rowData: Row,
  columns: Columns
): Row {
  const colIndex = columns.findIndex(
    (colName) => colName === updatedCell.colName
  );
  if (colIndex === -1) {
    throw new Error(
      "updatedCell has a column name that is not in the given row"
    );
  }

  rowData[colIndex] = updatedCell.newCell;
  refreshUI(rowData);
  return rowData;
}

function refreshUI(rowData: Row) {
  console.log(rowData);
}

let table: Row[] = [
  ["Kareem", "Amin", "Clay"],
  ["Jane", "", "Clay"],
  ["", "", ""],
];
let rowData = table[table.length - 1];
const initialColumns = ["First Name", "Last Name", "Company Name"];

// update to cell in column "First Name"
const firstUpdatedCell: CellUpdate = { colName: "First Name", newCell: "Luna" };
rowData = runWorkflowForRow(firstUpdatedCell, rowData, initialColumns);

// update to cell in column "Last Name"
const secondUpdatedCell: CellUpdate = {
  colName: "Last Name",
  newCell: "Ruan",
};
rowData = runWorkflowForRow(secondUpdatedCell, rowData, initialColumns);

// update to cell in column "Company Name"
const thirdUpdatedCell: CellUpdate = {
  colName: "Company Name",
  newCell: "Clay",
};
runWorkflowForRow(thirdUpdatedCell, rowData, initialColumns);
