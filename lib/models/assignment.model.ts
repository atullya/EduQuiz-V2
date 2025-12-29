import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dueDate: { type: Date, required: true },

  submissions: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      submissionText: String,
      submissionFile: String,
      submittedAt: { type: Date, default: Date.now },
      feedback: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Assignment =
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
export default Assignment;
