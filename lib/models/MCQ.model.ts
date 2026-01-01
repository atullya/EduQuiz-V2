import mongoose, { Document } from "mongoose";

interface MCQOption {
  key: string;
  value: string;
}

export interface IMCQ extends Document {
  question: string;
  options: MCQOption[];
  correct_answer: string;
  explanation?: string;
  question_type?: string;

  subject: string;
  chapter?: string;
  batchId?: string;

  class: mongoose.Types.ObjectId;
  section: string;
  teacher: mongoose.Types.ObjectId;

  duration: number;
  status: "draft" | "published";

  createdAt: Date;
  updatedAt: Date;
}

const mcqOptionSchema = new mongoose.Schema<MCQOption>({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

const mcqSchema = new mongoose.Schema<IMCQ>({
  question: { type: String, required: true },
  options: [mcqOptionSchema],
  correct_answer: { type: String, required: true },
  explanation: { type: String },
  question_type: { type: String, default: "Multiple Choice" },

  subject: { type: String, required: true },
  chapter: { type: String },
  batchId: { type: String },

  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  section: { type: String, required: true },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  duration: { type: Number, default: 0 },
  status: { type: String, enum: ["draft", "published"], default: "published" },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

mcqSchema.pre("save", function () {
  this.updatedAt = new Date();
});

const MCQ = mongoose.models.MCQ || mongoose.model<IMCQ>("MCQ", mcqSchema);
export default MCQ;
