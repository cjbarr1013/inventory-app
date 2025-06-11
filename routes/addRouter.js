const { Router } = require('express');
const titleController = require('../controllers/titleController');
const addRouter = Router();

// addRouter.post('/genre', genreController.addGenrePost);

// addRouter.post('/developer', developerController.addDeveloperPost);

addRouter.get('/title', titleController.addTitleGet);
// addRouter.post('/title', titleController.addTitlePost);

module.exports = addRouter;
