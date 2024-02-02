import {
  CellUpdate,
  Row,
  Columns,
  ColumnType,
  FormulaColumn,
  FormulaType,
} from "./types";

// function mockAPIResponse(metadata, rowParams) {
//   // mock the responses for the API
//   return result;
// }

// function getDataFromAPI(metadata, rowParams) {
//   return new Promise((resolve) => {
//     const result = mockAPIResponse(metadata, rowParams);
//     setTimeout(() => resolve(result), 2000);
//   });
// }

function evaluateFormula(
  formula: FormulaColumn,
  inputValues: Row,
  columnIndex: number
) {
  const { type } = formula.inputs;
  switch (type) {
    case FormulaType.Concat:
      if (inputValues.includes("")) {
        inputValues[columnIndex] = "MISSING INPUT";
      } else {
        inputValues[columnIndex] = `${formula.inputs.init} ${inputValues
          .filter((_v, i) => i !== columnIndex)
          .join(" ")}`;
      }
      break;
    case FormulaType.Extract:
      const { field, index, array } = formula.inputs;
      if (index >= array.length) {
        throw new Error("Invalid formula extraction inputs");
      }
      if (!(field in array[index])) {
        throw new Error("Invalid formula extraction inputs");
      }
      inputValues[columnIndex] = array[index].field;
      break;
    default:
      throw new Error("Invalid formula type");
  }
}

function updateDependantFormulaCols(columns: Columns, rowData: Row) {
  const formulaColIndices = columns
    .map((col, i) => {
      if (col.type === ColumnType.Formula) {
        return i;
      }
      return -1;
    })
    .filter((i) => i != -1);

  for (const i of formulaColIndices) {
    const formulaCol = columns[i];
    if (formulaCol.type !== ColumnType.Formula) {
      throw new Error("Dependency columns should only be Formulas");
    }
    evaluateFormula(formulaCol, rowData, i);
  }
}

export function runWorkflowForRow(
  updatedCell: CellUpdate,
  rowData: Row,
  columns: Columns
): Row {
  const colIndex = columns.findIndex(
    (column) => column.name === updatedCell.colName
  );
  if (colIndex === -1) {
    throw new Error(
      "updatedCell has a column name that is not in the given row"
    );
  }

  const updateColumn = columns[colIndex];
  switch (updateColumn.type) {
    case ColumnType.Basic:
      rowData[colIndex] = updatedCell.newCell;
      updateDependantFormulaCols(columns, rowData);
      break;
    case ColumnType.Formula:
      evaluateFormula(updateColumn, rowData, colIndex);
      break;
    // case ColumnType.API:
    default:
      throw new Error("Invalid column type");
  }

  // Find all columns that are likely to now change:

  refreshUI(rowData);
  return rowData;
}

function refreshUI(rowData: Row) {
  console.log(rowData);
}
