const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const classroomSchema = new Schema({
  id: { type: Number },
  schoolId: { type: Number },
  name: { type: String },
  level: { type: String },
  students: [{ type: Schema.Types.ObjectId, ref: "user" }],
  teachers: [{ type: Schema.Types.ObjectId, ref: "user" }],
});
module.exports = mongoose.model("classroom", classroomSchema);
