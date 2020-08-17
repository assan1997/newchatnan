const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const singleChatMessagesSchema = new Schema({
  messages: [
    {
      senderId: Number,
      profil: String,
      message_id: String,
      content: String,
      contentType: String,
      time: { type: String },
      isSeen: Boolean,
    },
  ],
});
module.exports = mongoose.model("singleChatMessages", singleChatMessagesSchema);
