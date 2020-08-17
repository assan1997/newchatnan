const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const MessagesGroupTeacherChatRoomSchema = new Schema({
  teacherChatRoomId: { type: Schema.Types.ObjectId, ref: 'TeachersChatRoom' },
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
  'MessagesGroupsTeachersChatRoom',
  MessagesGroupTeacherChatRoomSchema
);
