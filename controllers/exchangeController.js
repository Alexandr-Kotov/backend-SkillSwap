// controllers/exchangeController.js

const ExchangeRequest = require('../models/ExchangeRequest');

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await ExchangeRequest.find({ to: req.user }).populate('from to', 'name email');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.sendRequest = async (req, res) => {
  const { to, offerDetails } = req.body;
  const newReq = new ExchangeRequest({
    from: req.user, // из токена
    to,
    offerDetails
  });
  await newReq.save();
  res.status(201).json({ msg: 'Обмен отправлен' });
};

exports.getNewRequests = async (req, res) => {
  try {
    const newRequests = await ExchangeRequest.find({
      to: req.user,
      isNew: true
    }).populate('from', 'name');

    res.json(newRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markRequestsAsRead = async (req, res) => {
  try {
    await ExchangeRequest.updateMany(
      { to: req.user, isNew: true },
      { $set: { isNew: false } }
    );
    res.json({ msg: 'Уведомления прочитаны' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

