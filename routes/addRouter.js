const { Router } = require('express');
const indexController = require('../controllers/indexController');
const addRouter = Router();

addRouter.get('/', indexController.addGet);

// addRouter.get('/genre', genreController.addGenreGet);
// addRouter.post('/genre', genreController.addGenrePost);

// addRouter.get('/developer', developerController.addDeveloperGet);
// addRouter.post('/developer', developerController.addDeveloperPost);

// addRouter.get('/title', titleController.addTitleGet);
// addRouter.post('/title', titleController.addTitlePost);

module.exports = addRouter;
