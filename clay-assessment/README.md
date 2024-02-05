## To Run my Code

- `ts-node src/cases.ts` : to try all examples
- `npm test` : execute tests (used jest to write tests)
- `src/index.ts` : where my main logic lives
- `src/types.ts` : where all the types live

## High Level Approach

The system uses a Queue to manage dependencies between columns.
When a cell is updated, the corresponding column is identified, and dependent columns are enqueued for reevaluation.

Each cell has a display value and a hidden value. This is used for tying cells to information like `apiData` without rendering that data.

### References

[jest TS dir configuration](https://bootcamp.uxdesign.cc/how-to-write-test-cases-in-typescript-fa7a263b7833): Followed these steps to set up jest configuration

### Potential Improvements

Make `rowData` & `columns` an instance variable of a class, so I don't need to keep passing them into every function
