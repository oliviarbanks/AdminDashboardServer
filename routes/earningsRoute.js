const router = require('express').Router();
const earningsController = require('../controllers/earningsController');

router
    .route('/')
    .get(earningsController.getData)
    .post(earningsController.addData);

module.exports = router;