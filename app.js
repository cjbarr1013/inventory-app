require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const indexRouter = require('./routes/indexRouter');
const viewRouter = require('./routes/viewRouter');
const addRouter = require('./routes/addRouter');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

app.use('/view', viewRouter);
app.use('/add', addRouter);
app.use('/', indexRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`);
});
