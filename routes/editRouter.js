const { Router } = require('express');
const titleController = require('../controllers/titleController');
const genreController = require('../controllers/genreController');
const developerController = require('../controllers/developerController');
const editRouter = Router();

editRouter.get('/genre/:id', genreController.editGenreGet);
editRouter.post(
  '/genre/:id',
  genreController.validateEditGenre,
  genreController.editGenrePost
);

editRouter.get('/developer/:id', developerController.editDeveloperGet);
editRouter.post(
  '/developer/:id',
  developerController.validateEditDeveloper,
  developerController.editDeveloperPost
);

editRouter.get('/title/:id', titleController.editTitleGet);
editRouter.post(
  '/title/:id',
  titleController.validateTitle,
  genreController.validateGenreIsSelected,
  developerController.validateDeveloperIsSelected,
  genreController.validateNewGenreWithTitle,
  developerController.validateNewDeveloperWithTitle,
  genreController.saveNewGenre,
  developerController.saveNewDeveloper,
  titleController.editTitlePost
);

module.exports = editRouter;
