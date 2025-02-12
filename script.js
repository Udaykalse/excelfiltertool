const fs = require("fs");
const ExcelJS = require("exceljs");
const readline = require("readline");

const outputPath = "./Job-hustle2.xlsx";
if (!fs.existsSync(outputPath)) {
  console.error("❌ File not found:", outputPath);
  process.exit(1);
}
console.log("✅ File found:", outputPath);

// Function to prompt user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to read Excel and process data
async function readExcel(filterOption) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(outputPath);
  const sheet = workbook.worksheets[0];

  console.log("📖 Reading sheet:", sheet.name);

  const startRow = 1;
  const endRow = 3576;
  const tableData = [];
  const consoleTableData = [];

  for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
    const row = sheet.getRow(rowIndex);
    let hasColor = false;
    let rowData = { Row: rowIndex };
    let consoleRow = [`Row ${rowIndex}`];

    for (let colIndex = 2; colIndex <= 4; colIndex++) {
      const cell = row.getCell(colIndex);
      const value = cell.value || "(empty)";
      rowData[`Col${colIndex}`] = value;
      consoleRow.push(value);

      // Check for cell background color
      const fill = cell.fill;
      if (fill && fill.fgColor && fill.fgColor.argb !== "FFFFFFFF") {
        hasColor = true;
      }
    }

    // Apply filter based on user choice
    if (filterOption === "all" || (filterOption === "highlighted" && hasColor)) {
      tableData.push(rowData);
      consoleTableData.push(consoleRow);
    }
  }

  // Save to JSON file
  fs.writeFileSync("output.json", JSON.stringify(tableData, null, 2));
  console.log(`✅ Data (${filterOption}) written to output.json`);

  // Print table preview
  if (consoleTableData.length > 0) {
    console.log("\n📊 Extracted Data:\n");
    console.log("Row  | Col 2          | Col 3          | Col 4          ");
    console.log("-----------------------------------------------------");
    consoleTableData.forEach(row => console.log(row.join(" | ")));
  } else {
    console.log("⚠️ No matching rows found.");
  }

  console.log("\n📢 Open 'output.html' in a browser to view the data.");
  console.log("🚀 Ensure output.json is in the same directory as output.html.");
  rl.close();
}

rl.question(
  "Which rows do you want to see? (1) All Rows or (2) Highlighted Rows: ",
  (answer) => {
    if (answer === "1") {
      readExcel("all");
    } else if (answer === "2") {
      readExcel("highlighted");
    } else {
      console.log("❌ Invalid choice. Please restart and select 1 or 2.");
      rl.close();
    }
  }
);