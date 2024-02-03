import {
  CellUpdate,
  Row,
  Columns,
  ColumnType,
  FormulaColumn,
  FormulaType,
  ApiColumn,
  ApiType,
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

// Instructions mention that any can assume metadata necessary is passed in.
// So just stubbing out the response, and not actually passing it in here.
export function mockAPIResponse(apiType: ApiType, metadata?: any) {
  switch (apiType) {
    case ApiType.GoogleSearch:
      return [
        {
          url: "linkedin.com/in/kareemamin",
          text: "Kareem is the CEO & Founder of a NYC-based Startup called Clay...",
        },
        {
          url: "twitter.com/kareemamin",
          text: "Welcome to my Twitter profile....",
        },
      ];
    case ApiType.LiProfile:
      return [
        {
          name: "Kareem",
          job: "Software Engineer",
          tenure: "10 years",
        },
        {
          name: "Janvi",
          job: "Software Engineer",
          tenure: "3 years",
        },
      ];
  }
}

async function getDataFromAPI(
  rowData: Row,
  apiType: ApiType,
  apiColumnIndex: number
) {
  return new Promise((resolve) => {
    const result = mockAPIResponse(apiType);
    console.log("search result", result);
    rowData[apiColumnIndex].apiData = result;
    console.log("rowData[apiColumnIndex]", result);

    rowData[apiColumnIndex].val =
      apiType === ApiType.GoogleSearch ? "Search Found" : "Profile Found";
    setTimeout(() => resolve(result), 2000);
  });
}

async function evaluateApiColumn(
  column: ApiColumn,
  columns: Columns,
  rowData: Row,
  apiColumnIndex: number
) {
  const inputColumn =
    rowData[columns.findIndex((c) => c.name === column.inputColumnName)];
  if (inputColumn.val === "MISSING INPUT") {
    rowData[apiColumnIndex].val = "MISSING INPUT";
  } else {
    rowData[apiColumnIndex].val = "LOADING";
    await getDataFromAPI(rowData, column.apiType, apiColumnIndex);
    // Since something changed, see if formulas should change.
    await updateDependantFormulaCols(rowData, columns);
  }
}

async function evaluateFormula(
  formulaCol: FormulaColumn,
  columns: Columns,
  rowData: Row,
  formulaColIndex: number
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
        // If anything changed, see if anything in formulas should change.
        await updateDependantApiCols(rowData, columns);
      }
      break;
    case FormulaType.Extract:
      const { field, index, columnName } = formulaCol.inputs;
      console.log("got to extract for: ", columnName);

      const array =
        rowData[columns.findIndex((c) => c.name === columnName)].apiData;

      if (!array || index >= array.length) {
        rowData[formulaColIndex].val = "MISSING INPUT";
        break;
      }
      rowData[formulaColIndex] = array[index][field];
      // If anything changed, see if anything in formulas should change.
      await updateDependantApiCols(rowData, columns);
      break;
    default:
      throw new Error("Invalid formula type");
  }
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

async function updateDependantFormulaCols(rowData: Row, columns: Columns) {
  const formulaColIndices = columnIndicesOfType(columns, ColumnType.Formula);
  for (const i of formulaColIndices) {
    const formulaCol = columns[i];
    if (formulaCol.type !== ColumnType.Formula) {
      throw new Error("Dependency columns should only be Formulas");
    }
    await evaluateFormula(formulaCol, columns, rowData, i);
  }
}

async function updateDependantApiCols(rowData: Row, columns: Columns) {
  const colIndices = columns
    .map((col, i) => {
      if (col.type === ColumnType.API) {
        return i;
      }
      return -1;
    })
    .filter((i) => i != -1);

  for (const i of colIndices) {
    const col = columns[i];
    if (col.type !== ColumnType.API) {
      throw new Error("Dependency columns should only be Apis");
    }
    await evaluateApiColumn(col, columns, rowData, i);
  }
}

export async function runWorkflowForRow(
  updatedCell: CellUpdate,
  rowData: Row,
  columns: Columns
): Promise<Row> {
  const colIndex = columns.findIndex(
    (column) => column.name === updatedCell.colName
  );
  if (colIndex === -1) {
    throw new Error(
      "updatedCell has a column name that is not in the given row"
    );
  }

  const column = columns[colIndex];
  switch (column.type) {
    case ColumnType.Basic:
      rowData[colIndex] = updatedCell.newCell;
      await updateDependantFormulaCols(rowData, columns);
      await updateDependantApiCols(rowData, columns);
      break;
    case ColumnType.Formula:
      await evaluateFormula(column, columns, rowData, colIndex);
      await updateDependantFormulaCols(rowData, columns);
      await updateDependantApiCols(rowData, columns);

      break;
    case ColumnType.API:
      await evaluateApiColumn(column, columns, rowData, colIndex);
      await updateDependantFormulaCols(rowData, columns);
      await updateDependantApiCols(rowData, columns);

    default:
      throw new Error("Invalid column type");
  }

  // Find all columns that are likely to now change:

  refreshUI(rowData);
  return rowData;
}

function refreshUI(rowData: Row) {
  console.log(rowData.map((c) => c.val));
}
