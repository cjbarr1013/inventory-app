const { Router } = require('express');
const indexController = require('../controllers/indexController');
const genreController = require('../controllers/genreController');
const developerController = require('../controllers/developerController');
const titleController = require('../controllers/titleController');
const viewRouter = Router();

viewRouter.get('/byGenre', genreController.byGenreGet);

viewRouter.get('/byDeveloper', developerController.byDeveloperGet);

viewRouter.get('/all', titleController.titlesGet);
viewRouter.get('/all/:id', titleController.titleDetailsGet);

module.exports = viewRouter;
