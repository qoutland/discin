var router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('You made it to the api')
});

router.post('/', (req, res, next) => {
    res.send('Made it to api with POST');
});

module.exports = router;