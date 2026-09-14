const fs = require('fs');

try {
    const file25Path = 'heritage_cards_25.json';
    const file26Path = 'heritage_cards_26.json';

    let raw25 = JSON.parse(fs.readFileSync(file25Path, 'utf8'));
    let raw26 = JSON.parse(fs.readFileSync(file26Path, 'utf8'));

    function extractArray(data) {
        if (Array.isArray(data)) return data;
        if (data && typeof data === 'object') {
            for (const key of ['data', 'cards', 'results', 'items']) {
                if (Array.isArray(data[key])) return data[key];
            }
            for (const key of Object.keys(data)) {
                if (Array.isArray(data[key])) return data[key];
            }
        }
        return null;
    }

    const array25 = extractArray(raw25);
    const array26 = extractArray(raw26);

    console.log(`Analyzing datasets by Scryfall ID: (${array25.length} cards vs ${array26.length} cards)...\n`);

    // Map by Scryfall's unique card ID instead of name
    const map25 = new Map(array25.map(card => [card.id || card.name, card]));
    const map26 = new Map(array26.map(card => [card.id || card.name, card]));

    const removed = [];
    for (const [id, card] of map25) {
        if (!map26.has(id)) {
            removed.push(card);
        }
    }

    const added = [];
    for (const [id, card] of map26) {
        if (!map25.has(id)) {
            added.push(card);
        }
    }

    console.log('--- EXACT REMOVED PRINTINGS ---');
    if (removed.length > 0) {
        removed.forEach(c => console.log(`- [${c.set?.toUpperCase()}] ${c.name} (#${c.collector_number}) [ID: ${c.id}]`));
    } else {
        console.log('None found by ID.');
    }

    console.log('\n--- EXACT ADDED PRINTINGS ---');
    if (added.length > 0) {
        added.forEach(c => console.log(`+ [${c.set?.toUpperCase()}] ${c.name} (#${c.collector_number}) [ID: ${c.id}]`));
    } else {
        console.log('None found by ID.');
    }

} catch (err) {
    console.error('\n[FATAL ERROR]:', err.message);
    process.exit(1);
}
