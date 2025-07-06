const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');
const auth = require('../middleware/authMiddleware');


router.post('/', auth, exchangeController.sendRequest);
router.get('/my', auth, exchangeController.getMyRequests);
router.get('/new', auth, exchangeController.getNewRequests);
router.put('/mark-read', auth, exchangeController.markRequestsAsRead);



module.exports = router;