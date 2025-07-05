const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Шаг 1: регистрация (email + пароль)
router.post('/register/step1', userController.registerStep1);

// Шаг 2: заполнение профиля
router.post('/register/step2', userController.registerStep2);

// Шаг 3: добавление карточек
router.post('/register/step3/cards', userController.registerStep3AddCard);

// Логин
router.post('/login', userController.login);

// Защищённые роуты
router.get('/',  userController.getAllUsers);
router.get('/:id',  userController.getUserById);

// Лайки
router.post('/:id/like', auth, userController.likeUser);
router.delete('/:id/like', auth, userController.unlikeUser);

module.exports = router;
