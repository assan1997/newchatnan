const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const emojisSchema = new Schema({
  emojis: [{ type: Number }],
});
module.exports = mongoose.model('emojis', emojisSchema);
