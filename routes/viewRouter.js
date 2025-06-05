const { Router } = require('express');
const indexController = require('../controllers/indexController');
const genreController = require('../controllers/genreController');
const developerController = require('../controllers/developerController');
const titleController = require('../controllers/titleController');
const viewRouter = Router();

viewRouter.get('/', indexController.viewGet);

// viewRouter.get('/byGenre', genreController.byGenreGet);
// viewRouter.get('/byGenre/:genre', genreController.genreTitlesGet);

// viewRouter.get('/byDeveloper', developerController.byDeveloperGet);
// viewRouter.get(
//   '/byDeveloper/:developer',
//   developerController.developerTitlesGet
// );

// viewRouter.get('/all', titleController.allTitlesGet);
// viewRouter.get('/all/:title', titleController.titleGet);

module.exports = viewRouter;
