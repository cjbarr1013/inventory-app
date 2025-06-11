const db = require('../db/queries');

async function byDeveloperGet(req, res) {
  const developers = await db.getAllDevelopers();
  res.render('options', {
    title: 'Developer Selection',
    options: developers,
    category: 'developer',
  });
}

module.exports = {
  byDeveloperGet,
};
