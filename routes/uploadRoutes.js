const express = require('express');
const router = express.Router();
const { upload, handleUpload } = require('../controllers/uploadController');

// Загрузка нескольких фото (до 6)
router.post('/', upload.array('photos', 6), handleUpload);

module.exports = router;
