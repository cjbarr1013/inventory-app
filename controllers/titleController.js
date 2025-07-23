const { body, validationResult } = require('express-validator');
const db = require('../db/queries');

const validateTitle = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('You must enter a name for the video game.')
    .bail()
    .isLength({ Max: 50 })
    .withMessage('Length of name cannot exceed 50 characters.'),
  body('year')
    .isInt({ min: 1900, max: 2099 })
    .withMessage('Year must be whole number between 1900 and 2099'),
  body('coverArt')
    .trim()
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Cover art must be a valid URL.'),
];

async function titlesGet(req, res) {
  const { genre, developer } = req.query;
  let title, backPath, backMsg;
  let titles = [];

  if (genre) {
    const genreObj = await db.getGenreById(genre);
    title = genreObj ? `${genreObj.name} Games` : 'Genre not found';
    backPath = '/view/byGenre';
    backMsg = 'Back to genres';
    titles = await db.getTitlesByGenre(genre);
  } else if (developer) {
    const developerObj = await db.getDeveloperById(developer);
    title = developerObj
      ? `Games by ${developerObj.name}`
      : 'Developer not found';
    backPath = '/view/byDeveloper';
    backMsg = 'Back to developers';
    titles = await db.getTitlesByDeveloper(developer);
  } else {
    title = 'All Games';
    backPath = '/';
    backMsg = 'Back to home';
    titles = await db.getAllTitles();
  }

  res.render('titles', { title, backPath, backMsg, games: titles });
}

async function titleDetailsGet(req, res) {
  const { id } = req.params;
  const game = await db.getTitleById(id);
  res.render('titleDetails', { title: game.name, game: game });
}

async function addTitleGet(req, res) {
  const developers = await db.getAllDevelopers();
  const genres = await db.getAllGenres();
  res.render('modifyItem', {
    title: 'Add New Title',
    form: 'addTitleForm',
    developers,
    genres,
    oldName: '',
    selectedGenres: [],
    selectedDevelopers: [],
    oldYear: new Date().getFullYear(),
    oldCoverArt: '',
    cancelUrl: req.get('referer') || '/',
  });
}

async function addTitlePost(req, res) {
  const { name, genre, developer, year, coverArt } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const developers = await db.getAllDevelopers();
    const genres = await db.getAllGenres();
    return res.status(400).render('modifyItem', {
      title: 'Add New Title',
      form: 'addTitleForm',
      developers,
      genres,
      oldName: name,
      selectedGenres: genre.map((g) => parseInt(g)),
      selectedDevelopers: developer.map((d) => parseInt(d)),
      oldYear: year,
      oldCoverArt: coverArt,
      cancelUrl: '/view/all',
      errors: errors.array(),
    });
  }
  const newTitle = await db.addNewTitle(name, year, coverArt);

  for (const id of genre) {
    await db.connectTitleGenre(newTitle.id, id);
  }
  for (const id of developer) {
    await db.connectTitleDeveloper(newTitle.id, id);
  }

  res.redirect('/view/all');
}

async function editTitleGet(req, res) {
  const { id } = req.params;
  const game = await db.getTitleById(id);
  const developers = await db.getAllDevelopers();
  const genres = await db.getAllGenres();
  res.render('modifyItem', {
    title: 'Edit Title',
    form: 'editTitleForm',
    game,
    developers,
    genres,
    cancelUrl: req.get('referer') || '/',
  });
}

async function editTitlePost(req, res) {
  const { name, genre, developer, year, coverArt } = req.body;
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const developers = await db.getAllDevelopers();
    const genres = await db.getAllGenres();
    return res.status(400).render('modifyItem', {
      title: 'Edit Title',
      form: 'editTitleForm',
      game: {
        id: id,
        name: name,
        genre_ids: genre.map((g) => parseInt(g)),
        developer_ids: developer.map((d) => parseInt(d)),
        year: year,
        cover_art: coverArt,
      },
      developers,
      genres,
      cancelUrl: `/view/all/${id}`,
      errors: errors.array(),
    });
  }

  await db.editTitle(name, year, coverArt, id);
  await db.deleteAllTitleGenreConnections(id);
  await db.deleteAllTitleDeveloperConnections(id);

  for (const genreId of genre) {
    await db.connectTitleGenre(id, genreId);
  }
  for (const developerId of developer) {
    await db.connectTitleDeveloper(id, developerId);
  }

  res.redirect(`/view/all/${id}`);
}

async function deleteTitlePost(req, res) {
  const { id } = req.params;
  await db.deleteTitle(id);

  res.redirect('/view/all');
}

module.exports = {
  validateTitle,
  titlesGet,
  titleDetailsGet,
  addTitleGet,
  addTitlePost,
  editTitleGet,
  editTitlePost,
  deleteTitlePost,
};
