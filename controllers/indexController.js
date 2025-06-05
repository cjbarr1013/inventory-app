async function indexGet(req, res) {
  res.render('index', { title: 'Video Game Inventory' });
}

async function viewGet(req, res) {
  res.render('view', { title: 'View Inventory' });
}

async function addGet(req, res) {
  res.render('add', { title: 'Add to Inventory' });
}

module.exports = {
  indexGet,
  viewGet,
  addGet,
};
