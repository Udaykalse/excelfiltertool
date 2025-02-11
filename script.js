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

  const sheet = workbook.worksheets[0]; // First sheet
  console.log("📖 Reading sheet:", sheet.name);

  const startRow = 1;
  const endRow = 50;

  for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
    const row = sheet.getRow(rowIndex);
    let hasColor = false;
    let rowText = `Row ${rowIndex}: `;

    for (let colIndex = 1; colIndex <= 3; colIndex++) {
      const cell = row.getCell(colIndex);
      const value = cell.value || "(empty)";
      rowText += `Col ${colIndex}: ${value} | `;

      const fill = cell.fill;
      if (fill && fill.fgColor && fill.fgColor.argb !== "FFFFFFFF") {
        hasColor = true;
      }
    }

    if (hasColor) {
      console.log(rowText);
    }
  }
}

readExcel().catch(console.error);
