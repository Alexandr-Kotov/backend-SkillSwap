const mongoose = require('mongoose');

const ExchangeRequestSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  offerDetails: String, // или массив умений
  status: { type: String, default: 'pending' }, // pending, accepted, rejected
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExchangeRequest', ExchangeRequestSchema);
