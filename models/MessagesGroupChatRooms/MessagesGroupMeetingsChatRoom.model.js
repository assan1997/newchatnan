const mongoose = require('mongoose'); const { Schema } = require('mongoose');
const MessagesGroupMeetingChatRoomSchema = new Schema({
    meetingChatRoomId: { type: Schema.Types.ObjectId, ref: "MeetingsChatRoom" },
    messages: [{
        user: String,
        userId: Number,
        image: String,
        message_id: String,
        content: String,
        contentType: String,
        time: { type: String },
        colorMessage: String,
        readBy: [{id:Number,image:String,username:String}]
    }]
});

module.exports = mongoose.model('MessagesGroupsMeetingsChatRoom', MessagesGroupMeetingChatRoomSchema);