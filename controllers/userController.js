const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Skill = require('../models/Skill');

// 1 шаг регистрации — email + пароль
exports.registerStep1 = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();

    res.status(201).json({ msg: 'Step 1 complete. User created', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Функция для вычисления возраста
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// 2 шаг — заполнение данных профиля
exports.registerStep2 = async (req, res) => {
  try {
    const { userId, name, city, age, gender, about, photo, birthDate, wantsToLearn  } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.name = name || user.name;
    user.city = city || user.city;
    user.age = age || user.age;
    user.gender = gender || user.gender;
    user.about = about || user.about;
    user.photo = photo || user.photo;
    user.birthDate = birthDate || user.birthDate;

    if (birthDate) {
      user.age = calculateAge(birthDate);
    } else if (!user.age && user.birthDate) {
      // Если age нет, но есть birthDate в базе — тоже вычислим
      user.age = calculateAge(user.birthDate);
    }


    if (Array.isArray(wantsToLearn)) {
      const skillsFull = [];
      for (const skill of wantsToLearn) {
        const foundSkill = await Skill.findOne({ name: skill.name, categoryName: skill.categoryName });
        if (foundSkill) {
          skillsFull.push({
            _id: foundSkill._id,
            name: foundSkill.name,
            categoryName: foundSkill.categoryName
          });
        }
      }
      user.wantsToLearn = skillsFull;
    }

    await user.save();

    res.json({ msg: 'Step 2 complete. Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3 шаг — добавление карточек
exports.registerStep3AddCard = async (req, res) => {
  try {
    const { userId, title, description, photo, canTeach  } = req.body;

    if (!title) return res.status(400).json({ msg: 'Card title required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.cards.push({ title, description, photo });

    if (Array.isArray(canTeach)) {
      const skillsFull = [];
      for (const skill of canTeach) {
        const foundSkill = await Skill.findOne({ name: skill.name, categoryName: skill.categoryName });
        if (foundSkill) {
          skillsFull.push({
            _id: foundSkill._id,
            name: foundSkill.name,
            categoryName: foundSkill.categoryName
          });
        }
      }
      user.canTeach = skillsFull;
    }


    await user.save();


    res.status(201).json({ msg: 'Card added', card: user.cards[user.cards.length - 1] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Логин
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Получить всех пользователей (с токеном)
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

// Получить пользователя по id
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ msg: 'User not found' });
  res.json(user);
};

// Поставить лайк другому пользователю

exports.likeUser = async (req, res) => {
  try {
    const likedUserId = req.params.id;
    const currentUserId = req.user;

    if (likedUserId === currentUserId) {
      return res.status(400).json({ msg: 'Нельзя лайкать самого себя' });
    }

    const user = await User.findById(currentUserId);
    if (!user.likes.includes(likedUserId)) {
      user.likes.push(likedUserId);
      await user.save();
    }

    res.json({ msg: 'Лайк добавлен' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Удалить лайк
exports.unlikeUser = async (req, res) => {
  try {
    const likedUserId = req.params.id;
    const currentUserId = req.user;

    const user = await User.findById(currentUserId);
    user.likes = user.likes.filter(id => id.toString() !== likedUserId);
    await user.save();

    res.json({ msg: 'Лайк удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};