const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Настройка хранилища
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: "limit" }]
  }
});

const upload = multer({ storage });

// Контроллер обработки загрузки
const handleUpload = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const urls = req.files.map(file => file.path); // Cloudinary URL
    res.status(200).json({ urls });
  } catch (err) {
    console.error('Ошибка загрузки:', JSON.stringify(err, null, 2)); // <-- добавь это
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { upload, handleUpload };
