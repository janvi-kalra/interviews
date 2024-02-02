import {
  ColumnType,
  Columns,
  CellUpdate,
  Row,
  FormulaType,
} from "../src/types";
import { runWorkflowForRow } from "../src";

describe("[Step 1] Basic Columns", () => {
  let table: Row[] = [
    ["Kareem", "Amin", "Clay"],
    ["Jane", "", "Clay"],
    ["", "", ""],
  ];
  let rowData: Row = table[table.length - 1];
  let initialColumns: Columns = [
    { type: ColumnType.Basic, name: "First Name" },
    { type: ColumnType.Basic, name: "Last Name" },
    { type: ColumnType.Basic, name: "Company Name" },
  ];

  it(`update to cell in column "First Name"`, () => {
    const firstUpdatedCell: CellUpdate = {
      colName: "First Name",
      newCell: "Luna",
    };
    rowData = runWorkflowForRow(firstUpdatedCell, rowData, initialColumns);
    expect(rowData).toEqual(["Luna", "", ""]);
  });
  it(`update to cell in column "Last Name"`, () => {
    const secondUpdatedCell: CellUpdate = {
      colName: "Last Name",
      newCell: "Ruan",
    };
    rowData = runWorkflowForRow(secondUpdatedCell, rowData, initialColumns);
    expect(rowData).toEqual(["Luna", "Ruan", ""]);
  });
  it(`update to cell in column "Company Name"`, () => {
    const thirdUpdatedCell: CellUpdate = {
      colName: "Company Name",
      newCell: "Clay",
    };
    rowData = runWorkflowForRow(thirdUpdatedCell, rowData, initialColumns);
    expect(rowData).toEqual(["Luna", "Ruan", "Clay"]);
  });
});

describe("[Step 2] Formula Columns", () => {
  let table: Row[] = [
    ["Kareem", "Amin", "Clay", ""],
    ["Jane", "", "Clay", ""],
    ["", "", "", ""],
  ];
  let rowData: Row = table[table.length - 1];
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

  it(`update to cell in column "First Name"`, () => {
    const firstUpdatedCell: CellUpdate = {
      colName: "First Name",
      newCell: "Luna",
    };
    rowData = runWorkflowForRow(firstUpdatedCell, rowData, initialColumns);
    expect(rowData).toEqual(["Luna", "", "", "MISSING INPUT"]);
  });
  it(`update to cell in column "Last Name"`, () => {
    const secondUpdatedCell: CellUpdate = {
      colName: "Last Name",
      newCell: "Ruan",
    };
    rowData = runWorkflowForRow(secondUpdatedCell, rowData, initialColumns);
    expect(rowData).toEqual(["Luna", "Ruan", "", "MISSING INPUT"]);
  });
  it(`update to cell in column "Company Name"`, () => {
    const thirdUpdatedCell: CellUpdate = {
      colName: "Company Name",
      newCell: "Clay",
    };
    rowData = runWorkflowForRow(thirdUpdatedCell, rowData, initialColumns);
    expect(rowData).toEqual([
      "Luna",
      "Ruan",
      "Clay",
      "linkedin.com Luna Ruan Clay",
    ]);
  });
});

// describe.only("[Step 3] API Columns", () => {
//   let table: Row[] = [
//     ["Kareem", "Amin", "Clay", ""],
//     ["Jane", "", "Clay", ""],
//     ["", "", "", ""],
//   ];
//   let rowData: Row = table[table.length - 1];
//   let initialColumns: Columns = [
//     { type: ColumnType.Basic, name: "First Name" },
//     { type: ColumnType.Basic, name: "Last Name" },
//     { type: ColumnType.Basic, name: "Company Name" },
//     {
//       type: ColumnType.Formula,
//       name: "Google Search Input",
//       formula: {
//         type: FormulaType.Concat,
//         init: "linkedin.com",
//       },
//     },
//     {
//       type: ColumnType.API,
//       name: "Perform Search",
//       formula: {
//         type: FormulaType.Concat,
//         init: "linkedin.com",
//       },
//     },
//     {
//       type: ColumnType.Formula,
//       name: "Linkedin URL",
//       formula: {
//         type: FormulaType.Extract,
//         init: "linkedin.com",
//       },
//     },
//     {
//       type: ColumnType.API,
//       name: "Linkedin Data",
//       formula: {
//         type: FormulaType.Extract,
//         init: "linkedin.com",
//       },
//     },
//   ];

//   it(`update to cell in column "First Name"`, () => {
//     const firstUpdatedCell: CellUpdate = {
//       colName: "First Name",
//       newCell: "Luna",
//     };
//     rowData = runWorkflowForRow(firstUpdatedCell, rowData, initialColumns);
//     expect(rowData).toEqual(["Luna", "", "", "MISSING INPUT"]);
//   });
//   it(`update to cell in column "Last Name"`, () => {
//     const secondUpdatedCell: CellUpdate = {
//       colName: "Last Name",
//       newCell: "Ruan",
//     };
//     rowData = runWorkflowForRow(secondUpdatedCell, rowData, initialColumns);
//     expect(rowData).toEqual(["Luna", "Ruan", "", "MISSING INPUT"]);
//   });
//   it(`update to cell in column "Company Name"`, () => {
//     const thirdUpdatedCell: CellUpdate = {
//       colName: "Company Name",
//       newCell: "Clay",
//     };
//     rowData = runWorkflowForRow(thirdUpdatedCell, rowData, initialColumns);
//     expect(rowData).toEqual(["Luna", "Ruan", "Clay", "Luna Ruan Clay"]);
//   });
// });
