// controllers/exchangeController.js

const ExchangeRequest = require('../models/ExchangeRequest');

exports.getNewRequests = async (req, res) => {
  try {
    const newRequests = await ExchangeRequest.find({
      to: req.user._id,
      isNew: true
    }).populate('from', 'name');

    res.json(newRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await ExchangeRequest.find({
      to: req.user._id
    }).populate('from to', 'name email');

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markRequestsAsRead = async (req, res) => {
  try {
    console.log('Пользователь из токена:', req.user);

    const result = await ExchangeRequest.updateMany(
      { to: req.user._id, isNew: true },
      { $set: { isNew: false } }
    );

    res.json({ msg: 'Уведомления прочитаны', modified: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.sendRequest = async (req, res) => {
  const { to, offerDetails } = req.body;
  const newReq = new ExchangeRequest({
    from: req.user._id,
    to,
    offerDetails,
    isNew: true
  });
  await newReq.save();
  res.status(201).json({ msg: 'Обмен отправлен' });
};
