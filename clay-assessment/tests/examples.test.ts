import {
  ColumnType,
  Columns,
  CellUpdate,
  Row,
  FormulaType,
  ApiType,
} from "../src/types";
import { ColumnName, mockAPIResponse, runWorkflowForRow } from "../src";

describe("[Step 1] Basic Columns", () => {
  let rowData: Row = [{ val: "" }, { val: "" }, { val: "" }];
  let initialColumns: Columns = [
    { type: ColumnType.Basic, name: ColumnName.FirstName, deps: [] },
    { type: ColumnType.Basic, name: ColumnName.LastName, deps: [] },
    { type: ColumnType.Basic, name: ColumnName.CompanyName, deps: [] },
  ];
  it(`update to cell in column ColumnName.FirstName`, async () => {
    const firstUpdatedCell: CellUpdate = {
      colName: ColumnName.FirstName,
      newCell: { val: "Luna" },
    };
    rowData = await runWorkflowForRow(
      firstUpdatedCell,
      rowData,
      initialColumns
    );
    const answer = [{ val: "Luna" }, { val: "" }, { val: "" }];
    expect(JSON.stringify(rowData)).toEqual(JSON.stringify(answer));
  });
  it(`update to cell in column ColumnName.LastName`, async () => {
    const secondUpdatedCell: CellUpdate = {
      colName: ColumnName.LastName,
      newCell: { val: "Ruan" },
    };
    rowData = await runWorkflowForRow(
      secondUpdatedCell,
      rowData,
      initialColumns
    );
    const answer = [{ val: "Luna" }, { val: "Ruan" }, { val: "" }];
    expect(JSON.stringify(rowData)).toEqual(JSON.stringify(answer));
  });
  it(`update to cell in column ColumnName.CompanyName`, async () => {
    const thirdUpdatedCell: CellUpdate = {
      colName: ColumnName.CompanyName,
      newCell: { val: "Clay" },
    };
    rowData = await runWorkflowForRow(
      thirdUpdatedCell,
      rowData,
      initialColumns
    );
    const answer = [{ val: "Luna" }, { val: "Ruan" }, { val: "Clay" }];
    expect(JSON.stringify(rowData)).toEqual(JSON.stringify(answer));
  });
});

describe("[Step 2] Formula Columns", () => {
  let rowData: Row = [{ val: "" }, { val: "" }, { val: "" }, { val: "" }];
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
  ];

  it(`update to cell in column ColumnName.FirstName`, async () => {
    const firstUpdatedCell: CellUpdate = {
      colName: ColumnName.FirstName,
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
    ];
    expect(JSON.stringify(rowData)).toEqual(JSON.stringify(answer));
  });
  it(`update to cell in column ColumnName.LastName`, async () => {
    const secondUpdatedCell: CellUpdate = {
      colName: ColumnName.LastName,
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
    ];
    expect(JSON.stringify(rowData)).toEqual(JSON.stringify(answer));
  });
  it(`update to cell in column ColumnName.CompanyName`, async () => {
    const thirdUpdatedCell: CellUpdate = {
      colName: ColumnName.CompanyName,
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
    ];
    expect(JSON.stringify(rowData)).toEqual(JSON.stringify(answer));
  });
});

describe("[Step 3] API Columns", () => {
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

  it(`update to cell in column ColumnName.FirstName`, async () => {
    const firstUpdatedCell: CellUpdate = {
      colName: ColumnName.FirstName,
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
  it(`update to cell in column ColumnName.LastName`, async () => {
    const secondUpdatedCell: CellUpdate = {
      colName: ColumnName.LastName,
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
  it(`update to cell in column ColumnName.CompanyName`, async () => {
    const thirdUpdatedCell: CellUpdate = {
      colName: ColumnName.CompanyName,
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
        val: "Search Found",
        apiData: mockAPIResponse(ApiType.GoogleSearch),
      },
      {
        val: "linkedin.com/in/lunaruan",
      },
      {
        val: "Profile Found",
        apiData: mockAPIResponse(ApiType.LiProfile),
      },
    ];
    expect(JSON.stringify(rowData)).toEqual(JSON.stringify(answer));
  });
});
