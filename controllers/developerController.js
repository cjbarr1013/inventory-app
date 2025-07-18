const { body, validationResult } = require('express-validator');
const db = require('../db/queries');

const validateNewDeveloper = [
  body('newDeveloper')
    .trim()
    .notEmpty()
    .withMessage('You must enter at least one developer.')
    .bail()
    .customSanitizer((value) => value.split(',')),
];

const validateNewDeveloperWithTitle = [
  body('newDeveloper')
    .if(body('newDeveloper').trim().notEmpty()) // don't validate if empty
    .trim()
    .customSanitizer((value) => value.split(',')),
];

const validateEditDeveloper = [
  body('developer')
    .trim()
    .notEmpty()
    .withMessage(
      'You must have a developer entered here. If you wish to delete, please return to the previous page.'
    ),
];

const validateDeveloperIsSelected = [
  body(['developer', 'newDeveloper']).custom((value, { req }) => {
    const hasDeveloper = req.body.developer ? true : false;
    const hasNewDeveloper = req.body.newDeveloper ? true : false;
    if (!hasDeveloper && !hasNewDeveloper) {
      throw new Error('You must select a developer or enter a new one.');
    }
    return true;
  }),
];

async function byDeveloperGet(req, res) {
  const developers = await db.getAllDevelopers();
  res.render('options', {
    title: 'Developer Selection',
    options: developers,
    category: 'developer',
  });
}

async function addDeveloperGet(rep, res) {
  res.render('modifyItem', {
    title: 'Add New Developer',
    form: 'addOptionForm',
    option: 'developer',
    inputId: 'newDeveloper',
    oldName: '',
  });
}

async function addDeveloperPost(req, res) {
  const { newDeveloper } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('modifyItem', {
      title: 'Add New Developer',
      form: 'addOptionForm',
      option: 'developer',
      inputId: 'newDeveloper',
      oldName: newDeveloper,
      errors: errors.array(),
    });
  }
  // Move this to express-validator custom sanitizer
  for (const item of newDeveloper) {
    await db.addNewDeveloper(item.trim());
  }
  res.redirect('/view/byDeveloper');
}

async function editDeveloperGet(req, res) {
  const { id } = req.params;
  const developerObj = await db.getDeveloperById(id);
  const oldName = developerObj.name;
  res.render('modifyItem', {
    title: 'Edit Developer Name',
    form: 'editOptionForm',
    option: 'developer',
    optionId: id,
    oldName,
  });
}

async function editDeveloperPost(req, res) {
  const { developer } = req.body;
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const developerObj = await db.getDeveloperById(id);
    return res.status(400).render('modifyItem', {
      title: 'Edit Developer Name',
      form: 'editOptionForm',
      option: 'developer',
      optionId: id,
      oldName: developerObj.name,
      errors: errors.array(),
    });
  }
  await db.editDeveloper(developer, id);
  res.redirect('/view/byDeveloper');
}

async function deleteDeveloperPost(req, res) {
  const { id } = req.params;
  await db.deleteDeveloper(id);
  res.redirect('/view/byDeveloper');
}

async function saveNewDeveloper(req, res, next) {
  const { newDeveloper } = req.body;
  let newIds = [];
  if (newDeveloper.length > 0) {
    for (const developer of newDeveloper) {
      const row = await db.addNewDeveloper(developer);
      newIds.push(row.id);
    }
  }
  req.body.developer = req.body.developer
    ? newIds.concat(req.body.developer)
    : newIds;
  next();
}

module.exports = {
  validateNewDeveloper,
  validateNewDeveloperWithTitle,
  validateEditDeveloper,
  validateDeveloperIsSelected,
  addDeveloperGet,
  byDeveloperGet,
  addDeveloperPost,
  editDeveloperGet,
  editDeveloperPost,
  deleteDeveloperPost,
  saveNewDeveloper,
};
