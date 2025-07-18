const { Router } = require('express');
const titleController = require('../controllers/titleController');
const genreController = require('../controllers/genreController');
const developerController = require('../controllers/developerController');
const deleteRouter = Router();

deleteRouter.post('/genre/:id', genreController.deleteGenrePost);
deleteRouter.post('/developer/:id', developerController.deleteDeveloperPost);
deleteRouter.post('/title/:id', titleController.deleteTitlePost);

module.exports = deleteRouter;
