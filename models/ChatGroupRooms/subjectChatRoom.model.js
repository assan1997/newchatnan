const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const SubjectChatRoomSchema = new Schema({
  schoolId: { type: Number, required: true },
  subjectId: { type: Number, required: true },
  classroomId: { type: Number, required: true },
  messages: {
    type: Schema.Types.ObjectId,
    ref: "MessagesGroupsSubjectsChatRoom",
  },
  
});

module.exports = mongoose.model("SubjectsChatRoom", SubjectChatRoomSchema);
