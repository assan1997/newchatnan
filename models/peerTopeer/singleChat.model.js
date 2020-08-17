const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const SingleChatSchema = new Schema({
  initiator: { type: Number },
  peer: { type: Number },
  schoolId: { type: Number, required: true },
  chat: { type: Schema.Types.ObjectId, ref: "singleChatMessages" },
});

module.exports = mongoose.model("singleChat", SingleChatSchema);
