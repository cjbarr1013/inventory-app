const { body, validationResult } = require('express-validator');
const db = require('../db/queries');

const validateNewGenre = [
  body('newGenre')
    .trim()
    .notEmpty()
    .withMessage('You must enter at least one genre.')
    .bail()
    .customSanitizer((value) => value.split(',')),
];

const validateNewGenreWithTitle = [
  body('newGenre')
    .if(body('newGenre').trim().notEmpty()) // don't validate if empty
    .trim()
    .customSanitizer((value) => value.split(',')),
];

const validateEditGenre = [
  body('genre')
    .trim()
    .notEmpty()
    .withMessage(
      'You must have a genre entered here. If you wish to delete, please return to the previous page.'
    ),
];

const validateGenreIsSelected = [
  body(['genre', 'newGenre']).custom((value, { req }) => {
    const hasGenre = req.body.genre ? true : false;
    const hasNewGenre = req.body.newGenre ? true : false;
    if (!hasGenre && !hasNewGenre) {
      throw new Error('You must select a genre or enter a new one.');
    }
    return true;
  }),
];

async function byGenreGet(req, res) {
  const genres = await db.getAllGenres();
  res.render('options', {
    title: 'Genre Selection',
    options: genres,
    category: 'genre',
  });
}

async function addGenreGet(req, res) {
  res.render('modifyItem', {
    title: 'Add New Genre',
    form: 'addOptionForm',
    option: 'genre',
    inputId: 'newGenre',
    oldName: '',
  });
}

async function addGenrePost(req, res) {
  const { newGenre } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('modifyItem', {
      title: 'Add New Genre',
      form: 'addOptionForm',
      option: 'genre',
      inputId: 'newGenre',
      oldName: newGenre,
      errors: errors.array(),
    });
  }
  // Move this to express-validator custom sanitizer
  for (const item of newGenre) {
    await db.addNewGenre(item.trim());
  }
  res.redirect('/view/byGenre');
}

async function editGenreGet(req, res) {
  const { id } = req.params;
  const genreObj = await db.getGenreById(id);
  const oldName = genreObj.name;
  res.render('modifyItem', {
    title: 'Edit Genre Name',
    form: 'editOptionForm',
    option: 'genre',
    optionId: id,
    oldName,
  });
}

async function editGenrePost(req, res) {
  const { genre } = req.body;
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const genreObj = await db.getGenreById(id);
    return res.status(400).render('modifyItem', {
      title: 'Edit Genre Name',
      form: 'editOptionForm',
      option: 'genre',
      optionId: id,
      oldName: genreObj.name,
      errors: errors.array(),
    });
  }
  await db.editGenre(genre, id);
  res.redirect('/view/byGenre');
}

async function deleteGenrePost(req, res) {
  const { id } = req.params;
  await db.deleteGenre(id);
  res.redirect('/view/byGenre');
}

async function saveNewGenre(req, res, next) {
  const { newGenre } = req.body;
  let newIds = [];
  if (newGenre.length > 0) {
    for (const genre of newGenre) {
      const row = await db.addNewGenre(genre.trim());
      newIds.push(row.id);
    }
  }
  req.body.genre = req.body.genre ? newIds.concat(req.body.genre) : newIds;
  next();
}

module.exports = {
  validateNewGenre,
  validateNewGenreWithTitle,
  validateEditGenre,
  validateGenreIsSelected,
  byGenreGet,
  addGenreGet,
  addGenrePost,
  editGenreGet,
  editGenrePost,
  deleteGenrePost,
  saveNewGenre,
};
