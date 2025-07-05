// controllers/exchangeController.js
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
