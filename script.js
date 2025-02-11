// const fs = require("fs");
// const ExcelJS = require("exceljs");

// const outputPath = "./Job-hustle2.xlsx";
// if (!fs.existsSync(outputPath)) {
//   console.error("❌ File not found:", outputPath);
//   process.exit(1);
// }
// console.log("✅ File found:", outputPath);

// async function readExcel() {
//   const workbook = new ExcelJS.Workbook();
//   await workbook.xlsx.readFile(outputPath);

//   const sheet = workbook.worksheets[0]; 
//   console.log("📖 Reading sheet:", sheet.name);

//   const startRow = 50;
//   const endRow = 100;

//   for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
//     const row = sheet.getRow(rowIndex);
//     let hasColor = false;
//     let rowText = `Row ${rowIndex}: `;

//     for (let colIndex = 1; colIndex <= 4; colIndex++) {
//       const cell = row.getCell(colIndex);
//       const value = cell.value || "(empty)";
//       rowText += `Col ${colIndex}: ${value} | `;

//       const fill = cell.fill;
//       if (fill && fill.fgColor && fill.fgColor.argb !== "FFFFFFFF") {
//         hasColor = true;
//       }
//     }

//     if (hasColor) {
//       console.log(rowText);
//     }
//   }
// }

// readExcel().catch(console.error);

const fs = require("fs");
const ExcelJS = require("exceljs");

const outputPath = "./Job-hustle2.xlsx";
if (!fs.existsSync(outputPath)) {
  console.error("❌ File not found:", outputPath);
  process.exit(1);
}
console.log("✅ File found:", outputPath);

async function readExcel() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(outputPath);
  const sheet = workbook.worksheets[0];

  console.log("📖 Reading sheet:", sheet.name);

  const startRow = 1;
  const endRow = 100;
  const tableData = [];

  for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
    const row = sheet.getRow(rowIndex);
    let hasColor = false;
    let rowData = { Row: rowIndex };

    for (let colIndex = 1; colIndex <= 4; colIndex++) {
      const cell = row.getCell(colIndex);
      const value = cell.value || "(empty)";
      rowData[`Col${colIndex}`] = value;

      const fill = cell.fill;
      if (fill && fill.fgColor && fill.fgColor.argb !== "FFFFFFFF") {
        hasColor = true;
      }
    }

    if (hasColor) {
      tableData.push(rowData);
    }
  }

  fs.writeFileSync("output.json", JSON.stringify(tableData, null, 2));
  console.log("✅ Data written to output.json");

  console.log("\n📢 Now, open 'output.html' in a browser to view the data.");
  console.log("🚀 Make sure output.json is in the same directory as output.html.");
}

readExcel().catch(console.error);
