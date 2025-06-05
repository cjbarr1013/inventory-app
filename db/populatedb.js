const { Client } = require('pg');
const { argv } = require('node:process');

const SQL = `
CREATE TABLE IF NOT EXISTS video_games (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR ( 255 ),
  year INTEGER,
  cover_art VARCHAR ( 2048 ),
  added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS developers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS video_game_genres (
  video_game_id INTEGER REFERENCES video_games(id),
  genre_id INTEGER REFERENCES genres(id),
  PRIMARY KEY (video_game_id, genre_id)
);

CREATE TABLE IF NOT EXISTS video_game_developers (
  video_game_id INTEGER REFERENCES video_games(id),
  developer_id INTEGER REFERENCES developers(id),
  PRIMARY KEY (video_game_id, developer_id)
);

INSERT INTO video_games (title, year, cover_art)
VALUES
  ('Stardew Valley', 2016, 'https://upload.wikimedia.org/wikipedia/en/f/fd/Logo_of_Stardew_Valley.png'),
  ('Red Dead Redemption II', 2018, 'https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg'),
  ('Grand Theft Auto V', 2013, 'https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png'),
  ('Rocket League', 2015, 'https://upload.wikimedia.org/wikipedia/en/1/13/Rocket_League_cover.png'),
  ('Super Mario Odyssey', 2017, 'https://upload.wikimedia.org/wikipedia/en/8/8d/Super_Mario_Odyssey.jpg'),
  ('The Legend of Zelda: Tears of the Kingdom', 2023, 'https://upload.wikimedia.org/wikipedia/en/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg'),
  ('The Elder Scrolls V: Skyrim', 2011, 'https://upload.wikimedia.org/wikipedia/en/1/15/The_Elder_Scrolls_V_Skyrim_cover.png'),
  ('The Elder Scrolls IV: Oblivion', 2006, 'https://upload.wikimedia.org/wikipedia/en/4/4b/The_Elder_Scrolls_IV_Oblivion_cover.png'),
  ('Titanfall 2', 2016, 'https://upload.wikimedia.org/wikipedia/en/1/13/Titanfall_2.jpg'),
  ('Call of Duty: Modern Warfare 2', 2009, 'https://upload.wikimedia.org/wikipedia/en/5/52/Call_of_Duty_Modern_Warfare_2_%282009%29_cover.png'),
  ('Call of Duty: Black Ops III', 2015, 'https://upload.wikimedia.org/wikipedia/en/b/b1/Black_Ops_3.jpg'),
  ('Ratchet & Clank', 2016, 'https://upload.wikimedia.org/wikipedia/en/3/37/Ratchet_and_Clank_cover.jpg'),
  ('Jak 3', 2004, 'https://upload.wikimedia.org/wikipedia/en/e/ec/Jak_3_Coverart.png'),
  ('Spyro: Enter the Dragonfly', 2002, 'https://upload.wikimedia.org/wikipedia/en/a/ac/Spyro_-_Enter_the_Dragonfly_Coverart.jpg');

INSERT INTO genres (name)
VALUES
  ('Farm Life Sim'),
  ('Action-Adventure'),
  ('Sports'),
  ('Platform'),
  ('Action Role-Playing'),
  ('First-Person Shooter'),
  ('Third-Person Shooter');

INSERT INTO developers (name)
VALUES
  ('ConcernedApe'),
  ('Rockstar Games'),
  ('Psyonix'),
  ('Nintendo'),
  ('Bethesda'),
  ('Respawn Entertainment'),
  ('Infinity Ward'),
  ('Insomniac Games'),
  ('Naughty Dog'),
  ('Equinoxe Digital Entertainment'),
  ('Check Six Studios');

INSERT INTO video_game_genres (video_game_id, genre_id)
VALUES
  (1, 1),
  (2, 2),
  (3, 2),
  (4, 3),
  (5, 2),
  (5, 4),
  (6, 2),
  (7, 5),
  (8, 5),
  (9, 6),
  (10, 6),
  (11, 6),
  (12, 7),
  (12, 4),
  (13, 2),
  (13, 4),
  (14, 2),
  (14, 4);

INSERT INTO video_game_developers (video_game_id, developer_id)
VALUES
  (1, 1),
  (2, 2),
  (3, 2),
  (4, 3),
  (5, 4),
  (6, 4),
  (7, 5),
  (8, 5),
  (9, 6),
  (10, 7),
  (11, 7),
  (12, 8),
  (13, 9),
  (14, 10),
  (14, 11);
`;

async function main() {
  console.log('seeding...');
  const client = new Client({
    connectionString: argv[2],
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
}

main();
