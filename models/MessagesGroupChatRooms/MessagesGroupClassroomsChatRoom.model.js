const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const MessagesGroupClassroomChatRoomSchema = new Schema({
  messages: [
    {
      senderId: Number,
      message_id: String,
      content: String,
      contentType: String,
      time: { type: String },
      readBy: [{ type: Number }],
    },
  ],
});
module.exports = mongoose.model(
  "MessagesGroupsClassroomsChatRoom",
  MessagesGroupClassroomChatRoomSchema
);
