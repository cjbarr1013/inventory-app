const { Client } = require('pg');
const { argv } = require('node:process');

const SQL = `
DROP TABLE IF EXISTS video_games, genres, developers, video_game_developers, video_game_genres CASCADE;
`;

async function main() {
  console.log('clearing...');
  const client = new Client({
    connectionString: argv[2],
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
}

main();
