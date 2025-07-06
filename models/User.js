const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  _id: String,
  name: String,
  categoryName: String
}, { _id: false }); // отключаем авто _id, т.к. он у тебя уже задан как строка

const CardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  photo: [String],
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  // Шаг 1 — аутентификация
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  // Шаг 2 — профиль
  name: { type: String },
  city: { type: String },
  age: { type: Number },
  gender: { type: String },
  about: { type: String },
  photo: { type: String },
  birthDate: { type: Date },
  registerDate: { type: Date, default: Date.now },

  // Навыки
  canTeach: [SkillSchema],
  wantsToLearn: [SkillSchema],
  skillPhotos: [String],

  // Лайки
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // лучше использовать ObjectId

  // Шаг 3 — карточки
  cards: [CardSchema]
});

module.exports = mongoose.model('User', UserSchema);
