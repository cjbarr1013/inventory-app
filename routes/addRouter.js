const { Router } = require('express');
const titleController = require('../controllers/titleController');
const genreController = require('../controllers/genreController');
const developerController = require('../controllers/developerController');
const addRouter = Router();

addRouter.get('/title', titleController.addTitleGet);
addRouter.post(
  '/title',
  titleController.validateTitle,
  genreController.validateGenreIsSelected,
  developerController.validateDeveloperIsSelected,
  genreController.validateNewGenreWithTitle,
  developerController.validateNewDeveloperWithTitle,
  genreController.saveNewGenre,
  developerController.saveNewDeveloper,
  titleController.addTitlePost
);

addRouter.get('/genre', genreController.addGenreGet);
addRouter.post(
  '/genre',
  genreController.validateNewGenre,
  genreController.addGenrePost
);

addRouter.get('/developer', developerController.addDeveloperGet);
addRouter.post(
  '/developer',
  developerController.validateNewDeveloper,
  developerController.addDeveloperPost
);

module.exports = addRouter;
