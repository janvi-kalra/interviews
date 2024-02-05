import { Queue } from "./queue";
import {
  CellUpdate,
  Row,
  Columns,
  ColumnType,
  FormulaColumn,
  FormulaType,
  ApiColumn,
  ApiType,
  BasicColumn,
} from "./types";

export enum ColumnName {
  FirstName = "FirstName",
  LastName = "LastName",
  CompanyName = "CompanyName",
  GoogleSearchInput = "GoogleSearchInput",
  PerformSearch = "PerformSearch",
  LinkedinUrl = "LinkedinUrl",
  LinkedinData = "LinkedinData",
}

type ColumnNameQ = Queue<ColumnName>;

function getCellIndexFromColumnName(columns: Columns, columnName: ColumnName) {
  const index = columns.findIndex((column) => column.name === columnName);
  if (index === -1) {
    throw new Error(`no column name with the name: ${columnName}`);
  }
  return index;
}

// Instructions mention that any can assume metadata necessary is passed in.
// So just stubbing out the response, and not actually passing it in here.
export function mockAPIResponse(apiType: ApiType, metadata?: any) {
  switch (apiType) {
    case ApiType.GoogleSearch:
      return [
        {
          url: "linkedin.com/in/lunaruan",
          text: "Luna Ruan is...",
        },
        {
          url: "twitter.com/lunaruan",
          text: "Welcome to my Twitter profile....",
        },
      ];
    case ApiType.LiProfile:
      return [
        {
          name: "Luna Ruan",
          job: "Software Engineer",
          tenure: "10 years",
        },
        {
          name: "Janvi",
          job: "Software Engineer",
          tenure: "4 years",
        },
      ];
  }
}

function getDataFromAPI(
  rowData: Row,
  apiType: ApiType,
  apiColumnIndex: number
) {
  return new Promise((resolve) => {
    const result = mockAPIResponse(apiType);
    rowData[apiColumnIndex].apiData = result;

    rowData[apiColumnIndex].val =
      apiType === ApiType.GoogleSearch ? "Search Found" : "Profile Found";
    setTimeout(() => resolve(result), 2000);
  });
}

function evaluateApiColumn(
  column: ApiColumn,
  columns: Columns,
  rowData: Row,
  apiColumnIndex: number,
  Q: ColumnNameQ
) {
  const inputColumn =
    rowData[getCellIndexFromColumnName(columns, column.inputColumnName)];
  if (inputColumn.val === "MISSING INPUT") {
    rowData[apiColumnIndex].val = "MISSING INPUT";
  } else {
    rowData[apiColumnIndex].val = "LOADING";
    getDataFromAPI(rowData, column.apiType, apiColumnIndex);
  }
  updateQ(Q, columns, column.name);
}

function updateQ(
  Q: ColumnNameQ,
  columns: Columns,
  updatedColumnName: ColumnName
) {
  // Look at the deps of all the columns. If a column was dependent on this column,
  // now that this has been updated, update that too.
  for (const col of columns) {
    if (col.deps.includes(updatedColumnName)) {
      Q.enqueue(col.name);
    }
  }
}

function evaluateFormula(
  formulaCol: FormulaColumn,
  columns: Columns,
  rowData: Row,
  formulaColIndex: number,
  Q: ColumnNameQ
) {
  const { type } = formulaCol.inputs;
  switch (type) {
    case FormulaType.Concat:
      if (rowData.map((v) => v.val).includes("")) {
        rowData[formulaColIndex].val = "MISSING INPUT";
      } else {
        const basicColIndices = columnIndicesOfType(columns, ColumnType.Basic);
        rowData[formulaColIndex].val = `${formulaCol.inputs.init} ${rowData
          .map((c) => c.val)
          .filter(
            (_v, i) => i !== formulaColIndex && basicColIndices.includes(i)
          )
          .join(" ")}`;
      }
      break;
    case FormulaType.Extract:
      const { field, index, columnName } = formulaCol.inputs;
      const array =
        rowData[getCellIndexFromColumnName(columns, columnName)].apiData;

      if (!array || index >= array.length) {
        rowData[formulaColIndex].val = "MISSING INPUT";
        break;
      }
      rowData[formulaColIndex] = { val: array[index][field] };
      break;
    default:
      throw new Error("Invalid formula type");
  }
  updateQ(Q, columns, formulaCol.name);
}

function columnIndicesOfType(columns: Columns, columnType: ColumnType) {
  const formulaColIndices = columns
    .map((col, i) => {
      if (col.type === columnType) {
        return i;
      }
      return -1;
    })
    .filter((i) => i != -1);
  return formulaColIndices;
}

function getColumnFromColumnName(columns: Columns, columnName: ColumnName) {
  return columns.find((col) => col.name === columnName);
}

export function runWorkflowForRow(
  updatedCell: CellUpdate,
  rowData: Row,
  columns: Columns
): Row {
  const Q = new Queue<ColumnName>();
  const colIndex = getCellIndexFromColumnName(columns, updatedCell.colName);
  const column =
    columns[getCellIndexFromColumnName(columns, updatedCell.colName)];

  // Update the initial cell.
  switch (column.type) {
    case ColumnType.Basic:
      rowData[colIndex] = updatedCell.newCell;
      updateQ(Q, columns, updatedCell.colName);
      break;
    case ColumnType.Formula:
      evaluateFormula(column, columns, rowData, colIndex, Q);
      break;
    case ColumnType.API:
      evaluateApiColumn(column, columns, rowData, colIndex, Q);
      break;
    default:
      throw new Error("Invalid column type");
  }
  refreshUI(rowData);

  // Reevaluate all columns that were affected.
  let prevRowData = JSON.stringify(rowData);
  while (!Q.isEmpty()) {
    const depColName = Q.dequeue();
    if (!depColName) {
      break;
    }
    const depCol = getColumnFromColumnName(columns, depColName);
    const depColIndex = getCellIndexFromColumnName(columns, depColName);
    switch (depCol?.type) {
      case ColumnType.Formula:
        evaluateFormula(depCol, columns, rowData, depColIndex, Q);
        break;
      case ColumnType.API:
        evaluateApiColumn(depCol, columns, rowData, depColIndex, Q);
        break;
      case ColumnType.Basic:
        throw new Error("A basic column type cannot be a dependent column");
      default:
        throw new Error("Invalid column type");
    }
    // Only print out the UI if it has changed.
    if (prevRowData !== JSON.stringify(rowData)) {
      refreshUI(rowData);
      prevRowData = JSON.stringify(rowData);
    }
  }

  return rowData;
}

function refreshUI(rowData: Row) {
  console.log(rowData.map((c) => c.val));
}
