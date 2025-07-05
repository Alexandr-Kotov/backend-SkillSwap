const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  _id: String, // если у тебя _id — строка, например из mongo shell, или ObjectId, можно поменять
  name: { type: String, required: true },
  categoryName: { type: String, required: true }
}, { _id: false });

module.exports = mongoose.model('Skill', SkillSchema);
