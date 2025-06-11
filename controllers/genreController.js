const db = require('../db/queries');

async function byGenreGet(req, res) {
  const genres = await db.getAllGenres();
  res.render('options', {
    title: 'Genre Selection',
    options: genres,
    category: 'genre',
  });
}

module.exports = {
  byGenreGet,
};
