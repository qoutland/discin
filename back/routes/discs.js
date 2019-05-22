var router = require('express').Router();

//Controllers
var discController = require('../controllers/discController');

//Homepage
router.all('/', authorized, discController.disc_list);

//Create
router.get('/create', authorized, discController.disc_create_get);
router.post('/create', authorized, discController.disc_create_post);

//Update
router.get('/:id/update', authorized, discController.disc_update_get);
router.post('/:id/update', authorized, discController.disc_update_post);

//Delete
router.get('/:id/delete', authorized, discController.disc_delete_get);
router.post('/:id/delete', authorized, discController.disc_delete_post);

//More info
router.get('/:id', authorized, discController.disc_detail_get);
router.get(':/id', authorized, discController.disc_detail_post);

function authorized(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log(req.originalUrl)
    req.session.redirectTo = req.originalUrl;
    res.redirect('/login');
}


module.exports = router;