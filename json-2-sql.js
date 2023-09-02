const { Client } = require('pg');
const fs = require('fs');

const pgPassword = process.env.PG_PASS

const client = new Client({
    user: 'benlynch',
    host: 'localhost',
    database: 'prime_app',
    password: {pgPassword},
    port: 5432
});

const jsonData = JSON.parse(fs.readFileSync('megaten_data.json', 'utf8'));

async function insertData() {
    await client.connect();

    for (const personaName in jsonData) {
        const personaData = jsonData[personaName];

        const query = `
            INSERT INTO personas (name, cardlvl, heart, inherits, lvl, race, resists, skills, stats)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;

        const values = [
            personaName,
            personaData.cardlvl,
            personaData.heart || null,
            personaData.inherits,
            personaData.lvl,
            personaData.race,
            personaData.resists,
            JSON.stringify(personaData.skills),
            JSON.stringify(personaData.stats)
        ];

        try {
            await client.query(query, values);
            console.log(`Inserted data for ${personaName}`);
        } catch (error) {
            console.error(`Error inserting data for ${personaName}: ${error.message}`);
        }
    }

    await client.end();
}

insertData();
