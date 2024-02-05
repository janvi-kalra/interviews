### High Level Approach

- Every time a text changes, recompute all formulas
- Every time a formula changes, recompute all APIs
- I could hard code a bunch of dependant columns.

### Execute

`npm test`

### Sources References

- [jest TS dir configuration](https://bootcamp.uxdesign.cc/how-to-write-test-cases-in-typescript-fa7a263b7833): Followed these steps to set up jest configuration

### Learnings

- const [i, cell] of inputValues.entries(). Always OF. enumerate (python dic) vs entries (js)
- inputValues[columnIndex] = inputValues
  .filter((\_v, i) => i !== columnIndex)
  .join(" ");
- `.includes()` (inputValues.includes(""))
- jest

### Improvements

- Wish I had made rowData + columns an instance variable of a class. Wouldn't have needed to keep passing it around

### Note

- Example #4 switches from "search found" to "search complete"
