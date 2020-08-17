const {Schema} = require('mongoose');
const mongoose = require('mongoose');
const SchoolChatRoom = new Schema({
    schoolId:{type:Number,unique:true,required:true},
    messages:{type:Schema.Types.ObjectId,ref:"MessagesGroupsSchoolChatRoom"},
});

module.exports = mongoose.model('SchoolChatRoom',SchoolChatRoom);