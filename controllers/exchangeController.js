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
