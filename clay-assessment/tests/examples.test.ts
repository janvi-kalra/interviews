import {
  ColumnType,
  Columns,
  CellUpdate,
  Row,
  FormulaType,
  ApiType,
} from "../src/types";
import { mockAPIResponse, runWorkflowForRow } from "../src";

describe("[Step 1] Basic Columns", () => {
  let rowData: Row = [{ val: "" }, { val: "" }, { val: "" }];
  let initialColumns: Columns = [
    { type: ColumnType.Basic, name: "First Name" },
    { type: ColumnType.Basic, name: "Last Name" },
    { type: ColumnType.Basic, name: "Company Name" },
  ];

  it(`update to cell in column "First Name"`, () => {
    const firstUpdatedCell: CellUpdate = {
      colName: "First Name",
      newCell: { val: "Luna" },
    };
    rowData = runWorkflowForRow(firstUpdatedCell, rowData, initialColumns);
    const answer = [{ val: "Luna" }, { val: "" }, { val: "" }];
    expect(JSON.stringify(rowData)).toEqual(JSON.stringify(answer));
  });
  it(`update to cell in column "Last Name"`, () => {
    const secondUpdatedCell: CellUpdate = {
      colName: "Last Name",
      newCell: { val: "Ruan" },
    };
    rowData = runWorkflowForRow(secondUpdatedCell, rowData, initialColumns);
    const answer = [{ val: "Luna" }, { val: "Ruan" }, { val: "" }];
    expect(JSON.stringify(rowData)).toEqual(JSON.stringify(answer));
  });
  it(`update to cell in column "Company Name"`, () => {
    const thirdUpdatedCell: CellUpdate = {
      colName: "Company Name",
      newCell: { val: "Clay" },
    };
    rowData = runWorkflowForRow(thirdUpdatedCell, rowData, initialColumns);
    const answer = [{ val: "Luna" }, { val: "Ruan" }, { val: "Clay" }];
    expect(JSON.stringify(rowData)).toEqual(JSON.stringify(answer));
  });
});

describe("[Step 2] Formula Columns", () => {
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

  it(`update to cell in column "First Name"`, () => {
    const firstUpdatedCell: CellUpdate = {
      colName: "First Name",
      newCell: { val: "Luna" },
    };
    rowData = runWorkflowForRow(firstUpdatedCell, rowData, initialColumns);
    const answer = [
      { val: "Luna" },
      { val: "" },
      { val: "" },
      { val: "MISSING INPUT" },
    ];
    expect(JSON.stringify(rowData)).toEqual(JSON.stringify(answer));
  });
  it(`update to cell in column "Last Name"`, () => {
    const secondUpdatedCell: CellUpdate = {
      colName: "Last Name",
      newCell: { val: "Ruan" },
    };
    rowData = runWorkflowForRow(secondUpdatedCell, rowData, initialColumns);
    const answer = [
      { val: "Luna" },
      { val: "Ruan" },
      { val: "" },
      { val: "MISSING INPUT" },
    ];
    expect(JSON.stringify(rowData)).toEqual(JSON.stringify(answer));
  });
  it(`update to cell in column "Company Name"`, () => {
    const thirdUpdatedCell: CellUpdate = {
      colName: "Company Name",
      newCell: { val: "Clay" },
    };
    rowData = runWorkflowForRow(thirdUpdatedCell, rowData, initialColumns);
    const answer = [
      { val: "Luna" },
      { val: "Ruan" },
      { val: "Clay" },
      { val: "linkedin.com Luna Ruan Clay" },
    ];
    expect(JSON.stringify(rowData)).toEqual(JSON.stringify(answer));
  });
});

describe.only("[Step 3] API Columns", () => {
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

  it(`update to cell in column "First Name"`, async () => {
    const firstUpdatedCell: CellUpdate = {
      colName: "First Name",
      newCell: { val: "Luna" },
    };
    rowData = await runWorkflowForRow(
      firstUpdatedCell,
      rowData,
      initialColumns
    );
    const answer = [
      { val: "Luna" },
      { val: "" },
      { val: "" },
      { val: "MISSING INPUT" },
      { val: "MISSING INPUT" },
      { val: "MISSING INPUT" },
      { val: "MISSING INPUT" },
    ];
    expect(JSON.stringify(rowData)).toEqual(JSON.stringify(answer));
  });
  it(`update to cell in column "Last Name"`, async () => {
    const secondUpdatedCell: CellUpdate = {
      colName: "Last Name",
      newCell: { val: "Ruan" },
    };
    rowData = await runWorkflowForRow(
      secondUpdatedCell,
      rowData,
      initialColumns
    );
    const answer = [
      { val: "Luna" },
      { val: "Ruan" },
      { val: "" },
      { val: "MISSING INPUT" },
      { val: "MISSING INPUT" },
      { val: "MISSING INPUT" },
      { val: "MISSING INPUT" },
    ];
    expect(JSON.stringify(rowData)).toEqual(JSON.stringify(answer));
  });
  it(`update to cell in column "Company Name"`, async () => {
    const thirdUpdatedCell: CellUpdate = {
      colName: "Company Name",
      newCell: { val: "Clay" },
    };
    rowData = await runWorkflowForRow(
      thirdUpdatedCell,
      rowData,
      initialColumns
    );
    const answer = [
      { val: "Luna" },
      { val: "Ruan" },
      { val: "Clay" },
      { val: "linkedin.com Luna Ruan Clay" },
      {
        val: "Search Complete",
        apiData: mockAPIResponse(ApiType.GoogleSearch),
      },
      {
        val: "linkedin.com/in/kareemamin",
      },
      {
        val: "Profile Found",
        apiData: mockAPIResponse(ApiType.LiProfile),
      },
    ];
    expect(JSON.stringify(rowData)).toEqual(JSON.stringify(answer));
  });
});
