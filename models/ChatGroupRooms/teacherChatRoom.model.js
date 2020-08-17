const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const TeacherChatRoomSchema = new Schema({
  schoolId: { type: Number, required: true },
  classroomId: { type: Number, unique: true, required: true },
  messages: {
    type: Schema.Types.ObjectId,
    ref: 'MessagesGroupsTeachersChatRoom',
  },
});

module.exports = mongoose.model('TeachersChatRoom', TeacherChatRoomSchema);
