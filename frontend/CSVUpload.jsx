const fs = require('fs');
const Papa = require('papaparse');

const csvFile = fs.readFileSync('books.csv', 'utf8');
const parsedData = Papa.parse(csvFile, { header: true, dynamicTyping: true });

fs.writeFileSync('books.json', JSON.stringify(parsedData.data, null, 2));
console.log('Data written to books.json');
