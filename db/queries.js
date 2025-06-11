const pool = require('./pool');

async function getAllGenres() {
  const { rows } = await pool.query('SELECT * FROM genres');
  return rows;
}

async function getAllDevelopers() {
  const { rows } = await pool.query('SELECT * FROM developers');
  return rows;
}

async function getAllTitles() {
  const { rows } = await pool.query(
    `
    SELECT 
      vg.id, 
      vg.name, 
      vg.year, 
      vg.cover_art,
      ARRAY_AGG(DISTINCT d.name) AS developers,
      ARRAY_AGG(DISTINCT g.name) AS genres
    FROM video_games vg
      JOIN video_game_developers vgd ON vg.id = vgd.video_game_id
      JOIN developers d ON vgd.developer_id = d.id
      JOIN video_game_genres vgg ON vg.id = vgg.video_game_id
      JOIN genres g ON vgg.genre_id = g.id
    GROUP BY vg.id, vg.name, vg.year, vg.cover_art
    `
  );
  return rows;
}

async function getGenreById(id) {
  const { rows } = await pool.query(
    `
    SELECT * FROM genres
    WHERE id=$1
    `,
    [id]
  );
  return rows[0];
}

async function getDeveloperById(id) {
  const { rows } = await pool.query(
    `
    SELECT * FROM developers
    WHERE id=$1
    `,
    [id]
  );
  return rows[0];
}

async function getTitleById(id) {
  const { rows } = await pool.query(
    `
    SELECT 
      vg.id, 
      vg.name, 
      vg.year, 
      vg.cover_art,
      ARRAY_AGG(DISTINCT d.name) AS developers,
      ARRAY_AGG(DISTINCT g.name) AS genres
    FROM video_games vg
      JOIN video_game_developers vgd ON vg.id = vgd.video_game_id
      JOIN developers d ON vgd.developer_id = d.id
      JOIN video_game_genres vgg ON vg.id = vgg.video_game_id
      JOIN genres g ON vgg.genre_id = g.id
    WHERE vg.id = $1
    GROUP BY vg.id, vg.name, vg.year, vg.cover_art
    `,
    [id]
  );
  return rows[0];
}

async function getTitlesByGenre(genreId) {
  const { rows } = await pool.query(
    `
    SELECT 
      vg.id, 
      vg.name, 
      vg.year, 
      vg.cover_art,
      ARRAY_AGG(DISTINCT d.name) AS developers,
      ARRAY_AGG(DISTINCT g.name) AS genres
    FROM video_games vg
      JOIN video_game_developers vgd ON vg.id = vgd.video_game_id
      JOIN developers d ON vgd.developer_id = d.id
      JOIN video_game_genres vgg ON vg.id = vgg.video_game_id
      JOIN genres g ON vgg.genre_id = g.id
    WHERE vg.id IN (
      SELECT video_game_id FROM video_game_genres WHERE genre_id = $1
    )
    GROUP BY vg.id, vg.name, vg.year, vg.cover_art
    `,
    [genreId]
  );
  return rows;
}

async function getTitlesByDeveloper(devId) {
  const { rows } = await pool.query(
    `
    SELECT 
      vg.id, 
      vg.name, 
      vg.year, 
      vg.cover_art,
      ARRAY_AGG(DISTINCT d.name) AS developers,
      ARRAY_AGG(DISTINCT g.name) AS genres
    FROM video_games vg
      JOIN video_game_developers vgd ON vg.id = vgd.video_game_id
      JOIN developers d ON vgd.developer_id = d.id
      JOIN video_game_genres vgg ON vg.id = vgg.video_game_id
      JOIN genres g ON vgg.genre_id = g.id
    WHERE vg.id IN (
      SELECT video_game_id FROM video_game_developers WHERE developer_id = $1
    )
    GROUP BY vg.id, vg.name, vg.year, vg.cover_art
    `,
    [devId]
  );
  return rows;
}

module.exports = {
  getAllGenres,
  getAllDevelopers,
  getAllTitles,
  getGenreById,
  getDeveloperById,
  getTitleById,
  getTitlesByGenre,
  getTitlesByDeveloper,
};
