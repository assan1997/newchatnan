const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const classroomChatRoomSchema = new Schema({
  schoolId: { type: Number, required: true },
  classroomId: { type: Number, unique: true, required: true },
  messages: {
    type: Schema.Types.ObjectId,
    ref: "MessagesGroupsClassroomsChatRoom",
  },
});
module.exports = mongoose.model("ClassroomsChatRoom", classroomChatRoomSchema);
