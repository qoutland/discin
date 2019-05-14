var express = require('express');
var router = express.Router();

var auth = require('./auth');

//Controllers
var discController = require('../controllers/discController');

//Homepage
router.get('/', auth.required, discController.disc_list);

//Create
router.get('/create', auth.required, discController.disc_create_get);
router.post('/create', auth.required, discController.disc_create_post);

//Update
router.get('/:id/update', auth.required, discController.disc_update_get);
router.post('/:id/update', auth.required, discController.disc_update_post);

//Delete
router.get('/:id/delete', auth.required, discController.disc_delete_get);
router.post('/:id/delete', auth.required, discController.disc_delete_post);

//More info
router.get('/:id', discController.disc_detail_get);
router.get(':/id', discController.disc_detail_post);

router.get('/discs', discController.disc_list);
//router.post('')
//router.get('')

module.exports = router;