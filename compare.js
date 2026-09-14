const fs = require('fs');

try {
    console.log('Scanning workspace directory for files...');
    const files = fs.readdirSync('.');
    console.log('Available files:', files);

    const file25Path = 'heritage_cards_25.json';
    const file26Path = 'heritage_cards_26.json';

    // Verify files exist before attempting to read
    if (!fs.existsSync(file25Path) || !fs.existsSync(file26Path)) {
        console.error(`\n[ERROR] Missing database snapshot files. Expected '${file25Path}' and '${file26Path}' in the repository root.`);
        process.exit(1);
    }

    console.log(`\nLoading ${file25Path}...`);
    const file25 = JSON.parse(fs.readFileSync(file25Path, 'utf8'));

    console.log(`Loading ${file26Path}...`);
    const file26 = JSON.parse(fs.readFileSync(file26Path, 'utf8'));

    console.log(`Comparing datasets (${file25.length} cards vs ${file26.length} cards)...\n`);

    const set25 = new Map(file25.map(card => [card.name, card]));
    const set26 = new Map(file26.map(card => [card.name, card]));

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
