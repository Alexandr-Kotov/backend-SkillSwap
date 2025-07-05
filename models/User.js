const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  _id: String,
  name: String,
  categoryName: String
});

const UserSchema = new mongoose.Schema({
  name: String,
  city: String,
  age: Number,
  about: String,
  email: { type: String, unique: true },
  password: String,
  photo: String,
  birthDate: Date,
  registerDate: Date,
  canTeach: [SkillSchema],
  wantsToLearn: [SkillSchema],
  likes: [String],
  skillPhotos: [String]
});

module.exports = mongoose.model('User', UserSchema);
