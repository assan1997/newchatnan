const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const userSchema = new Schema({
  id: { type: Number },
  classroomId: {
    type: Number,
  },
  schoolId: {
    type: Number,
  },
  classroomIds: [{ type: Schema.Types.ObjectId, ref: "classroom" }],
  name: { type: String },
  email: { type: String },
  password: { type: String },
  role: { type: String },
  subject: { type: String },
  profil: { type: String },
});
module.exports = mongoose.model("user", userSchema);
