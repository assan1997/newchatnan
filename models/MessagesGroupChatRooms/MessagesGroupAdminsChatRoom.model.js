const mongoose = require('mongoose'); const { Schema } = require('mongoose');
const MessagesGroupAdminChatRoomSchema = new Schema({
    adminChatRoomId: { type: Schema.Types.ObjectId, ref: "AdminsChatRoom" },
    messages: [{
        user: String,
        userId: Number,
        image: String,
        message_id: String,
        content: String,
        contentType: String,
        time: { type: String },
        colorMessage: String,
        readBy: [{ id: Number, image: String, username: String }]
    }]
});
module.exports = mongoose.model('MessagesGroupsAdminsChatRoom', MessagesGroupAdminChatRoomSchema);