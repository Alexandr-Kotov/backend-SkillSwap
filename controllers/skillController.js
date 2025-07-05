const Skill = require('../models/Skill');

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find({});
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
