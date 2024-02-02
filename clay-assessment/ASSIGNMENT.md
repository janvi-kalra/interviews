# Goals

- We will be assessing:
  1. High-level problem-solving skills
  2. Code fluency, design and abstractions
  3. Verification and handling edge cases
  4. General autonomy in choosing and communicating trade-offs, and prioritizing and driving the solution forward
- Implementation of the exercise should take **no more than 3 hours** (_excluding_ reading through these instructions). Feel free to look up documentation and API references, but please work on the solution on your own. Abstain from using tools like ChatGPT.
- This exercise **does not** include building an actual UI
- Performance is not a consideration when solving this problem

# Workflows

With Clay, users can run a sequence of commands, i.e. a workflow, within a table. The goal of this exercise is to implement a rudimentary version of a workflow.

## Step 1: Basic Workflows

Workflows can be defined as a set of columns in a table. Our first step is to support a table with **“basic”** columns, where users can enter text or numbers in its cells. For this step, we want to support a workflow with three **“basic”** text columns:

- **_"First Name"_**
- **_"Last Name"_**
- **_"Company Name"_**

In order to do this, we need to create a function, `runWorkflowForRow(updatedCell, rowData, columns)`**.**

`runWorkflowForRow(updatedCell, rowData, columns)` \*\*\*\*is meant to be called every time the user updates a cell value, and takes in the following arguments:

- `updatedCell`: The new value of a cell that was updated in the UI by the user. **You can define the structure of this input according to your needs.**
- `rowData`: An object containing the data of all the cells in the row prior to the cell update. **You can define the structure of this input according to your needs**.
- `columns`: The columns that represent the workflow that has already been created by the user. **You can define the structure of this input according to your needs.**

`runWorkflowForRow` should return the value of the new row.

This function should call a `refreshUI(rowData)` function any time a cell value is updated. This function should print out to console the updated values in the row, i.e. the updated `rowData` (pretty printing is **not** a requirement).

We have provided some pseudocode below, but feel free to implement this however you’d like:

```tsx
// Define the type for CellUpdate, Cell, Row, and Columns
/*
 *	 type Columns = ...
 *.  type Cell = ...
 * 	 type Row = ...
 *	 type CellUpdate = ...
 */

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
```

### Example Workflow

A sample table UI might look something like this:

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/8f52c702-c9aa-42d6-97e1-de08ede98fa4/efc5f5f3-624c-48d5-a1c1-e760fbc28ecf/Untitled.png)

Once the user starts entering data in the cells of the **_“basic”_** columns, we would expect to see the following states sequentially occur in the table:

1. **The user enters `"Luna"` in the first row's cell for column _"First Name"_**

   ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/8f52c702-c9aa-42d6-97e1-de08ede98fa4/eb972170-8ee9-4d51-b4dd-6503ed799dd6/Untitled.png)

2. **The user enters `"Ruan"` in the first row's cell for column _"Last Name"_:**

   ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/8f52c702-c9aa-42d6-97e1-de08ede98fa4/84f5a4fd-7edf-4f6a-b55d-f440e0612b46/Untitled.png)

3. **3. The user enters `"Clay"` in the first row's cell for column _"Company name"._:**

   ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/8f52c702-c9aa-42d6-97e1-de08ede98fa4/4ff66381-bcb7-44ea-8bf4-29529af17818/Untitled.png)

### Deliverable

A runnable file (e.g. `node index.js` , `ts-node index.ts`, `python main.py`, etc) which should call `runWorkflowForRow(updatedCell, rowData, columns`) 3 times:

- once with an update to the cell in column _"First Name"_.
- once with an update to the cell in column _"Last Name"._
- once with an update to the cell in column _"Company Name”_.

As a result of each of these calls, `refreshUI` should print the values in each row.

---

## Step 2. Formula Columns

Next, we want to extend `runWorkflowForRow` to support **“formula”** columns, where the user defines their own formula that automatically computes a value (e.g. string concatenation, arithmetic) if provided the inputs.

- If a cell in a **_“formula”_** column has all required inputs, it automatically computes and resolves to a value (e.g. string concatenation, arithmetic).
- If a cell in a **_“formula”_** column \*\*is missing one or more inputs, it will show a `"MISSING INPUT"` status rather than a value.

Concretely, we want to extend the workflow from **Step 1** to add a **“formula”** column:

- **\*“Google Search Input”**,\*which concatenates the string `"[linkedin.com](http://linkedin.com/)"` and the cell values in columns **"First Name"** and **"Last Name"** and **"Company name"**. (ex. `linkedin.com Kareem Amin Clay`)

To do this, `runWorkflowForRow` will need to call an `**evaluateFormula(formula, inputValues)**` function when it encounters a formula column to evaluate the formula.

```tsx

function evaluateFormula(formula, inputValues) {
 // Support two types of formulas
 //   - string concatenation of the input values
 **//   - e**xtracting a field from a value in an array of values

```

### **Considerations**

- You will need to extend the Columns data structure defined in the previous step to represent a formula column as well as a basic column.
- Be mindful of how each column will keep track of its dependencies.

### Example Workflow

In the following example, a user created a new table which implements the following workflow:

- Given a person's first name, last name, and company name, create a Google search input with “linkedin.com” and the person’s information

After the workflow has been set up, a sample table UI might look something like this

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/8f52c702-c9aa-42d6-97e1-de08ede98fa4/c32cdf00-b40a-47ab-bfbe-6947ad6fc3e8/Untitled.png)

Once the user starts entering data in the cells of the **_“basic”_** columns, we would expect to see the following states sequentially occur in the table:

1. **The user enters `"Luna"` in the first row's cell for column _"First Name"_**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/8f52c702-c9aa-42d6-97e1-de08ede98fa4/5755d9ea-5a7a-4df5-a255-e3adb96ffb38/Untitled.png)

1. **The user enters `"Ruan"` in the first row's cell for column _"Last Name"_:**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/8f52c702-c9aa-42d6-97e1-de08ede98fa4/fab8126e-8d50-4cc6-aaf7-de79c3ede50b/Untitled.png)

**3. The user enters `"Clay"` in the first row's cell for column _"Company name". Note that “Google Search Input” populates automatically without user input_:**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/8f52c702-c9aa-42d6-97e1-de08ede98fa4/7789be76-6f85-4812-b973-5b85aa8c821f/Untitled.png)

### Deliverable

Modify `runWorkflowForRow(updatedCell, rowData, columns)` from Step 1 to support a **_“Google Search Input”_** formula column that works as specified above.

---

## Step 3: API Columns

Finally, we want to extend `runWorkflowForRow(updatedCell, rowData, columns)` to support **“API”** columns. An "**_API_**" column allows the user to make 3rd-party API calls and populate cells with external data. The user can select the "API" type to be used by the "API" column (e.g. `Perform Google Search` or `Get LinkedIn Profile Data`). API columns must meet the follow specifications:

- An **\*“API”** column\* can require inputs to execute the corresponding 3rd-party API calls.
- If a cell in an **\*“API”** column\* is missing one or more inputs, it will show a `"MISSING INPUT"` status rather than a value.
- If a cell in an **\*“API”** column\* has all required inputs but the API call has not yet completed, it will show a `"LOADING"` status rather than a value.
- If a cell in an “API” column completed successfully, the cell will display a value (E.g. “**Search Results Found**”.) The cell should also contain the full data from the API result. For example:

```tsx
{
   google_search_results: [
     {
        url: 'linkedin.com/in/kareemamin'
        text: 'Kareem is the CEO & Founder of a NYC-based Startup called Clay...'
     },
     {
        url: 'twitter.com/kareemamin'
        text: 'Welcome to my Twitter profile....'
     },
     ...
   ]
}
```

To do this, `runWorkflowForRow` will need to make an HTTP request to get the API data when it encounters an **_“API”_** column*.* For the purposes of this exercise, we have provided you a mock fetch that you can hard code to return the output of your API requests.

```tsx
function mockAPIResponse(metadata, rowParams) {
  // mock the responses for the API
  return result;
}

function getDataFromAPI(metadata, rowParams) {
  return new Promise((resolve) => {
    const result = mockAPIResponse(metadata, rowParams);
    setTimeout(() => resolve(result), 2000);
  });
}
```

In this step, we want to support the rest of the [example workflow](https://www.notion.so/704f9d6a676f4d49810d8113d7ab81ac?pvs=21), which consists of:

- 1 **“Formula”** column:
  - **_"LinkedIn URL":_** a "formula" column that extracts the url value of the first result in the array of results (e.g. `results[0].url`) from the _“Google Search”_ _”API”_ column described below. (ex. `"https://www.linkedin.com/in/kareemamin"`)
- 2 **“API”** columns:
  - **_“Google Search”_:** an "API" column of type `Perform Google Search`. The Google search API requires one input parameter named `search_text`. The `search_text` parameter is configured to use the cell value of the _"Google Search Input"_ column.
  - **_“LinkedIn Data”_:** an "API" column of type `Get LinkedIn Profile Data`. The LinkedIn API requires one input parameter named `profile_url`. The `profile_url` parameter is configured to use the cell value of the _"LinkedIn URL"_ column.

**Considerations**

- for each _“API”_ column type (e.g. `Perform Google Search`, `Get LinkedIn Profile Data`), you can assume that the column will be provided with any metadata needed for each API type; i.e. the URL for the API call, the list of input parameters for the query (e.g. `search_text` for `Perform Google Search` type, and `profile_url` for `Get LinkedIn Profile Data` type).
- Remember that cells in **_"API"_** columns display a different value than the data returned by the API call.
- Be mindful of how each column will keep track of its dependencies. Specifically, `runWorkflowForRow(updatedCell, rowData, columns)` will need some way to determine the ordered column dependencies when a cell is updated.
  - For e.g., when a cell value in the column _"First Name"_ gets updated, the ordered column dependencies are: _"Google Search Input"_, then _"Google Search"_, then _"LinkedIn URL"_, then _"LinkedIn Data"_, because:
    - _"Google Search Input"_ has its formula directly depend on the values in the _"First Name"_ column.
    - _"Google Search"_ has its input directly depend on the values in the _"Google Search Input"_ column, which depends on the values in the _"First Name"_ column.
    - _"LinkedIn URL"_ has its values directly depend on the values in the _"Google Search"_ column, which depends on the values in the _"Google Search Input"_ column, which depends on the values in the _"First Name"_ column.
    - etc...

### Example Workflow

In this example, a user created a new table which implements the following workflow:

- Given a person's first name, last name, and company name, perform a Google Search to find the person's LinkedIn URL. Use the LinkedIn URL to get the LinkedIn data from their LinkedIn page.

After the workflow has been set up, a sample table UI might look something like this:

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/8f52c702-c9aa-42d6-97e1-de08ede98fa4/f1fb3f3f-d5b5-4d82-804a-f9ed8275daee/Untitled.png)

Once the user starts entering data in the cells of the **_“basic”_** columns, we would expect to see the following states sequentially occur in the table:

1. **The user enters `"Luna"` in the first row's cell for column _"First Name"_**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/8f52c702-c9aa-42d6-97e1-de08ede98fa4/71e3927e-4d41-46d8-a6e2-619b3ef478c0/Untitled.png)

1. **The user enters `"Ruan"` in the first row's cell for column _"Last Name"_:**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/8f52c702-c9aa-42d6-97e1-de08ede98fa4/c5eff5fe-3dcb-4794-984c-1d984b3c6cdb/Untitled.png)

**3. The user enters `"Clay"` in the first row's cell for column _"Company name"._:**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/8f52c702-c9aa-42d6-97e1-de08ede98fa4/fc89be4c-ab42-4d42-a965-0b9b5a6be3d9/Untitled.png)

1. **The rest of the states appear _automatically_, without user input:**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/8f52c702-c9aa-42d6-97e1-de08ede98fa4/366cd235-b66f-48cf-80b1-574826e51fe6/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/8f52c702-c9aa-42d6-97e1-de08ede98fa4/84b699cb-ec59-4cdf-b57d-ef9580309d0d/Untitled.png)

### Deliverable

Modify `runWorkflowForRow(updatedCell, rowData, columns)` function from **Step 2** to add the “Perform Search”, “LinkedIn URL”, and “LinkedIn Data” columns described above.

As a result of these calls, the execution of the workflow should be visualized in the console as `refreshUI` prints the updated values to console.
