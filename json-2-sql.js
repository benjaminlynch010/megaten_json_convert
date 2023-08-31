const { Client } = require('pg');
const fs = require('fs');

const pgPassword = process.env.PG_PASS

const client = new Client({
    user: 'benlynch',
    host: 'localhost',
    database: 'megaten_p3',
    password: {pgPassword},
    port: 5432
});

const jsonData = JSON.parse(fs.readFileSync('megaten_data.json', 'utf8'));

async function insertData() {
    await client.connect();

    for (const demonName in jsonData) {
        const demonData = jsonData[demonName];

        const query = `
            INSERT INTO demons (name, cardlvl, heart, inherits, lvl, race, resists, skills, stats)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;

        const values = [
            demonName,
            demonData.cardlvl,
            demonData.heart || null,
            demonData.inherits,
            demonData.lvl,
            demonData.race,
            demonData.resists,
            JSON.stringify(demonData.skills),
            JSON.stringify(demonData.stats)
        ];

        try {
            await client.query(query, values);
            console.log(`Inserted data for ${demonName}`);
        } catch (error) {
            console.error(`Error inserting data for ${demonName}: ${error.message}`);
        }
    }

    await client.end();
}

insertData();
