const { escapeIdentifier } = require('pg');
const pool = require('./pool');

async function getAllGenres() {
  const { rows } = await pool.query('SELECT * FROM genres ORDER BY name');
  return rows;
}

async function getAllDevelopers() {
  const { rows } = await pool.query('SELECT * FROM developers ORDER BY name');
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
      LEFT JOIN video_game_developers vgd ON vg.id = vgd.video_game_id
      LEFT JOIN developers d ON vgd.developer_id = d.id
      LEFT JOIN video_game_genres vgg ON vg.id = vgg.video_game_id
      LEFT JOIN genres g ON vgg.genre_id = g.id
    GROUP BY vg.id, vg.name, vg.year, vg.cover_art
    ORDER BY vg.name
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
      ARRAY_AGG(DISTINCT d.id) AS developer_ids,
      ARRAY_AGG(DISTINCT g.name) AS genres,
      ARRAY_AGG(DISTINCT g.id) AS genre_ids
    FROM video_games vg
      LEFT JOIN video_game_developers vgd ON vg.id = vgd.video_game_id
      LEFT JOIN developers d ON vgd.developer_id = d.id
      LEFT JOIN video_game_genres vgg ON vg.id = vgg.video_game_id
      LEFT JOIN genres g ON vgg.genre_id = g.id
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
      LEFT JOIN video_game_developers vgd ON vg.id = vgd.video_game_id
      LEFT JOIN developers d ON vgd.developer_id = d.id
      LEFT JOIN video_game_genres vgg ON vg.id = vgg.video_game_id
      LEFT JOIN genres g ON vgg.genre_id = g.id
    WHERE vg.id IN (
      SELECT video_game_id FROM video_game_genres WHERE genre_id = $1
    )
    GROUP BY vg.id, vg.name, vg.year, vg.cover_art
    ORDER BY vg.name
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
      LEFT JOIN video_game_developers vgd ON vg.id = vgd.video_game_id
      LEFT JOIN developers d ON vgd.developer_id = d.id
      LEFT JOIN video_game_genres vgg ON vg.id = vgg.video_game_id
      LEFT JOIN genres g ON vgg.genre_id = g.id
    WHERE vg.id IN (
      SELECT video_game_id FROM video_game_developers WHERE developer_id = $1
    )
    GROUP BY vg.id, vg.name, vg.year, vg.cover_art
    ORDER BY vg.name
    `,
    [devId]
  );
  return rows;
}

async function addNewTitle(name, year, coverArt) {
  const result = await pool.query(
    'INSERT INTO video_games (name, year, cover_art) VALUES ($1, $2, $3) RETURNING *',
    [name, year, coverArt]
  );

  return result.rows[0];
}

async function connectTitleGenre(titleId, genreId) {
  await pool.query(
    'INSERT INTO video_game_genres (video_game_id, genre_id) VALUES ($1, $2)',
    [titleId, genreId]
  );
}

async function connectTitleDeveloper(titleId, developerId) {
  await pool.query(
    'INSERT INTO video_game_developers (video_game_id, developer_id) VALUES ($1, $2)',
    [titleId, developerId]
  );
}

async function addNewGenre(genre) {
  const result = await pool.query(
    'INSERT INTO genres (name) VALUES ($1) RETURNING *',
    [genre]
  );
  return result.rows[0];
}

async function addNewDeveloper(developer) {
  const result = await pool.query(
    'INSERT INTO developers (name) VALUES ($1) RETURNING *',
    [developer]
  );
  return result.rows[0];
}

async function editTitle(name, year, coverArt, id) {
  const result = await pool.query(
    'UPDATE video_games SET name = ($1), year = ($2), cover_art = ($3) WHERE id = ($4) RETURNING *',
    [name, year, coverArt, id]
  );
  return result.rows[0];
}

async function editGenre(newName, id) {
  await pool.query('UPDATE genres SET name = ($1) WHERE id = ($2)', [
    newName,
    id,
  ]);
}

async function editDeveloper(newName, id) {
  await pool.query('UPDATE developers SET name = ($1) WHERE id = ($2)', [
    newName,
    id,
  ]);
}

async function deleteTitle(id) {
  await pool.query('DELETE from video_games WHERE id = ($1)', [id]);
}

async function deleteAllTitleGenreConnections(id) {
  await pool.query('DELETE from video_game_genres WHERE video_game_id = ($1)', [
    id,
  ]);
}

async function deleteAllTitleDeveloperConnections(id) {
  await pool.query(
    'DELETE from video_game_developers WHERE video_game_id = ($1)',
    [id]
  );
}

async function deleteGenre(id) {
  await pool.query('DELETE from genres WHERE id = ($1)', [id]);
}

async function deleteDeveloper(id) {
  await pool.query('DELETE from developers WHERE id = ($1)', [id]);
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
  addNewTitle,
  connectTitleGenre,
  connectTitleDeveloper,
  addNewGenre,
  addNewDeveloper,
  editTitle,
  editGenre,
  editDeveloper,
  deleteTitle,
  deleteAllTitleGenreConnections,
  deleteAllTitleDeveloperConnections,
  deleteGenre,
  deleteDeveloper,
};
