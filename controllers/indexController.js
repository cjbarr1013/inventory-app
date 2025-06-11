async function indexGet(req, res) {
  res.render('index', { title: 'Video Game Inventory' });
}

module.exports = {
  indexGet,
};
