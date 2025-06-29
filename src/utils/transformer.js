import XLSX from 'xlsx';
import fs from 'fs';

console.log('Running transformer.js');

function extractMortalityData(filePath) {
  // Read the workbook
  const workbook = XLSX.readFile(filePath);
  
  // Get the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  // Find the start of the data (skip headers)
  let startRow = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === 0 || data[i][0] === '0') {
      startRow = i;
      break;
    }
  }
  
  const result = [];
  
  for (let i = startRow; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 10 || row[0] === undefined) continue;
    
    const age = Number(row[0]);
    if (isNaN(age)) continue;
    
    const mortalityData = {
      age: age,
      qx: {
        total: Number(row[1]),
        male: Number(row[2]),
        female: Number(row[3])
      },
      px: {
        total: Number(row[4]),
        male: Number(row[5]),
        female: Number(row[6])
      },
      ex: {
        total: Number(row[7]),
        male: Number(row[8]),
        female: Number(row[9])
      }
    };
    
    result.push(mortalityData);
  }
  
  return result;
}

// Usage
const filePath = 'ALEK EXPORT.xlsx';
const mortalityData = extractMortalityData(filePath);

// Save to JSON file
const outputPath = 'mortality_data.json';
fs.writeFileSync(outputPath, JSON.stringify(mortalityData, null, 2));

console.log(`Data extracted and saved to ${outputPath}`);