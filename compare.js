const fs = require('fs');

try {
    const file25Path = 'heritage_cards_25.json';
    const file26Path = 'heritage_cards_26.json';

    if (!fs.existsSync(file25Path) || !fs.existsSync(file26Path)) {
        console.error(`[ERROR] Missing files: '${file25Path}' or '${file26Path}'.`);
        process.exit(1);
    }

    let raw25 = JSON.parse(fs.readFileSync(file25Path, 'utf8'));
    let raw26 = JSON.parse(fs.readFileSync(file26Path, 'utf8'));

    // Extract array whether the file is a direct array or a Scryfall list object
    const array25 = Array.isArray(raw25) ? raw25 : (raw25.data && Array.isArray(raw25.data) ? raw25.data : null);
    const array26 = Array.isArray(raw26) ? raw26 : (raw26.data && Array.isArray(raw26.data) ? raw26.data : null);

    if (!array25 || !array26) {
        console.error('[FATAL ERROR] JSON structure is neither a direct array nor a recognized Scryfall list object.');
        process.exit(1);
    }

    console.log(`Comparing datasets (${array25.length} cards vs ${array26.length} cards)...\n`);

    const set25 = new Map(array25.map(card => [card.name, card]));
    const set26 = new Map(array26.map(card => [card.name, card]));

    const removed = [];
    for (const [name, card] of set25) {
        if (!set26.has(name)) {
            removed.push(card);
        }
    }

    const added = [];
    for (const [name, card] of set26) {
        if (!set25.has(name)) {
            added.push(card);
        }
    }

    console.log('--- REMOVED CARDS ---');
    if (removed.length > 0) {
        removed.forEach(c => console.log(`- ${c.name} (Set: ${c.set}, Number: ${c.collector_number})`));
    } else {
        console.log('None');
    }

    console.log('\n--- ADDED CARDS ---');
    if (added.length > 0) {
        added.forEach(c => console.log(`+ ${c.name} (Set: ${c.set}, Number: ${c.collector_number})`));
    } else {
        console.log('None');
    }

} catch (err) {
    console.error('\n[FATAL ERROR] An exception occurred during execution:', err.message);
    process.exit(1);
}
