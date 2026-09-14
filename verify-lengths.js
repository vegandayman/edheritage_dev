const fs = require('fs');

const file25 = JSON.parse(fs.readFileSync('heritage_cards_25.json', 'utf8'));
const file26 = JSON.parse(fs.readFileSync('heritage_cards_26.json', 'utf8'));

console.log(`Array 25 Length: ${file25.length}`);
console.log(`Array 26 Length: ${file26.length}`);

if (file25.length > file26.length) {
    console.log('\nChecking the last element of file 25 that exceeds file 26 bounds:');
    console.log(file25[file25.length - 1]);
}