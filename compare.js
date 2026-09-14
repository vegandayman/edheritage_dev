const fs = require('fs');

// Load both JSON database snapshots
const file25 = JSON.parse(fs.readFileSync('heritage_cards_25.json', 'utf8'));
const file26 = JSON.parse(fs.readFileSync('heritage_cards_26.json', 'utf8'));

// Map card names into Sets for fast lookups
const set25 = new Map(file25.map(card => [card.name, card]));
const set26 = new Map(file26.map(card => [card.name, card]));

// Find cards present on the 25th but missing on the 26th
const removed = [];
for (const [name, card] of set25) {
    if (!set26.has(name)) {
        removed.push(card);
    }
}

// Find cards present on the 26th that weren't there on the 25th
const added = [];
for (const [name, card] of set26) {
    if (!set25.has(name)) {
        added.push(card);
    }
}

console.log('--- REMOVED CARDS ---');
console.log(removed.length > 0 ? removed.map(c => `${c.name} (Set: ${c.set}, Number: ${c.collector_number})`) : 'None');

console.log('\n--- ADDED CARDS ---');
console.log(added.length > 0 ? added.map(c => `${c.name} (Set: ${c.set}, Number: ${c.collector_number})`) : 'None');