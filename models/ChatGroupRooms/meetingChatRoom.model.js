const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const MeetingChatRoom = new Schema({
    schoolId: { type: Number, required: true },
    messages: { type: Schema.Types.ObjectId, ref: "MessagesGroupsMeetingsChatRoom" },
    subjectId: { type: Number, required: true },
    classroomId: { type: Number, required: true },
    meetingId: { type: Number, unique: true, required: true }
});

module.exports = mongoose.model('MeetingsChatRoom', MeetingChatRoom);