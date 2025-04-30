const mongoose = require('mongoose');

const CompetitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, required: true },
  region: { type: String, required: true },
  institute: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
//   status: { type: String, enum: ['Upcoming', 'Running', 'Ended'], default: 'Upcoming' },
});

module.exports = mongoose.model('Competition', CompetitionSchema);