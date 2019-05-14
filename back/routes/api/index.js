var express = require('express');
var router = express.Router();

router.use('/api', require('../api'));

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express', type: 'GET' });
});

router.post('/', (req, res, next) => {
  res.render('index', { title: 'Express', type: 'POST' });
});

router.put('/', (req, res, next) => {
  res.render('index', { title: 'Express', type: 'PUT' });
});

router.delete('/', (req, res, next) => {
  res.render('index', { title: 'Express', type: 'DELETE' });
});

module.exports = router;
