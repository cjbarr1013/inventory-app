const db = require('../db/queries');

async function titlesGet(req, res) {
  const { genre, developer } = req.query;
  let title;
  let titles = [];

  if (genre) {
    const genreObj = await db.getGenreById(genre);
    title = genreObj ? `${genreObj.name} Games` : 'Genre not found';
    titles = await db.getTitlesByGenre(genre);
  } else if (developer) {
    const developerObj = await db.getDeveloperById(developer);
    title = developerObj
      ? `Games by ${developerObj.name}`
      : 'Developer not found';
    titles = await db.getTitlesByDeveloper(developer);
  } else {
    title = 'All Games';
    titles = await db.getAllTitles();
  }

  res.render('titles', { title, games: titles });
}

async function titleDetailsGet(req, res) {
  const { id } = req.params;
  const game = await db.getTitleById(id);
  res.render('titleDetails', { title: game.name, game: game });
}

async function addTitleGet(req, res) {
  const developers = await db.getAllDevelopers();
  const genres = await db.getAllGenres();
  res.render('addTitle', {
    title: 'Add New Title',
    developers,
    genres,
  });
}

module.exports = {
  titlesGet,
  titleDetailsGet,
  addTitleGet,
};
