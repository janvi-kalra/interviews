import {
  ColumnType,
  Columns,
  CellUpdate,
  Row,
  FormulaType,
  ApiType,
  Cell,
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

async function runCases(rowData: Row, columns: Columns) {
  const firstUpdatedCell: CellUpdate = {
    colName: ColumnName.FirstName,
    newCell: { val: "Luna" },
  };
  const secondUpdatedCell: CellUpdate = {
    colName: ColumnName.LastName,
    newCell: { val: "Ruan" },
  };
  const thirdUpdatedCell: CellUpdate = {
    colName: ColumnName.CompanyName,
    newCell: { val: "Clay" },
  };
  try {
    console.log("************* TRIGGER CELL UPDATE 1 *************");
    rowData = await runWorkflowForRow(firstUpdatedCell, rowData, columns);
    console.log("************* TRIGGER CELL UPDATE 2 *************");
    rowData = await runWorkflowForRow(secondUpdatedCell, rowData, columns);
    console.log("************* TRIGGER CELL UPDATE 3 *************");
    rowData = await runWorkflowForRow(thirdUpdatedCell, rowData, columns);
  } catch (error) {
    console.log("FAILED WITH ERROR:", error);
    throw error;
  }
}

runCases(rowData, initialColumns);

/// Learnings:
// 1. ts-node allows running await/async as top level
// 2. the highest level needs to be .then() because cannot do await/async
// 3. inside functions CAN do await

// HARD PROBLEM
// Walk away
// Think
// Rubber duck
// Do strategies and write your learnings from each strategy
// Don't just stare at the computer and randomly try things, going into deep rabbit holes and then
// doing undo/redo. Huge time + energy suck & not using my brain.
