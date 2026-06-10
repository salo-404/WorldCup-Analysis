const fs = require("fs");
const path = require("path");

const GENERATED_PATH = path.join(__dirname, "training_matches.csv");
const REAL_PATH = path.join(__dirname, "real_training_matches.csv");
const OUTPUT_PATH = path.join(__dirname, "combined_training_matches.csv");

const FINAL_HEADERS = [
  "teamA",
  "teamB",
  "teamAAttack",
  "teamAMidfield",
  "teamADefense",
  "teamAFormScore",
  "teamAStrength",
  "teamBAttack",
  "teamBMidfield",
  "teamBDefense",
  "teamBFormScore",
  "teamBStrength",
  "result",
];

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function readCsvObjects(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }

  const lines = fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean);

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    return row;
  });
}

function csvValue(value) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function toFinalCsvRow(row) {
  return FINAL_HEADERS.map((header) => csvValue(row[header])).join(",");
}

function countClasses(rows) {
  const counts = {
    teamAWin: 0,
    draw: 0,
    teamBWin: 0,
  };

  rows.forEach((row) => {
    if (counts[row.result] !== undefined) {
      counts[row.result] += 1;
    }
  });

  return counts;
}

function main() {
  const generatedRows = readCsvObjects(GENERATED_PATH);
  const realRows = readCsvObjects(REAL_PATH);

  /*
    Real API rows are more valuable because they are true historical outcomes.
    We duplicate them to give them stronger influence during training.
  */
  const realWeight = 5;
  const weightedRealRows = [];

  for (let i = 0; i < realWeight; i += 1) {
    weightedRealRows.push(...realRows);
  }

  const combinedRows = [...generatedRows, ...weightedRealRows];

  const outputLines = [
    FINAL_HEADERS.join(","),
    ...combinedRows.map(toFinalCsvRow),
  ];

  fs.writeFileSync(OUTPUT_PATH, outputLines.join("\n"), "utf8");

  console.log("Combined training CSV generated");
  console.log("--------------------------------");
  console.log(`Generated rows: ${generatedRows.length}`);
  console.log(`Real API rows: ${realRows.length}`);
  console.log(`Real row weight: ${realWeight}x`);
  console.log(`Final rows: ${combinedRows.length}`);
  console.log("Class counts:", countClasses(combinedRows));
  console.log(`Output: ${OUTPUT_PATH}`);
}

main();