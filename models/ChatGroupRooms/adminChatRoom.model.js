const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const adminChatRoom = new Schema({
    schoolId: { type: Number, unique: true, required: true },
    messages: { type: Schema.Types.ObjectId, ref: "MessagesGroupsAdminsChatRoom" }
});

module.exports = mongoose.model('AdminsChatRoom', adminChatRoom);