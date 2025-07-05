const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');

router.post('/', exchangeController.sendRequest);
router.get('/my', exchangeController.getMyRequests);

module.exports = router;