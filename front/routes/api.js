var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(["Tony","Lisa","Quin","Ginger","Food"]);
});

module.exports = router;
