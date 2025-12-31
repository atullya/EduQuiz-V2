import mongoose, { Schema, Document, Model } from "mongoose";


export interface IMCQAttempt {
  mcqId: mongoose.Types.ObjectId;
  selectedOption?: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface IQuizAttempt extends Document {
  student: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  section: string;
  subject: string;
  chapter: string;
  mcqs: IMCQAttempt[];
  score: number;
  correctAnswers: number;
  duration?: number;
  startedAt: Date;
  submittedAt?: Date;
}

const quizAttemptSchema = new Schema<IQuizAttempt>({
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  class: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  section: { type: String, required: true },
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  mcqs: [
    {
      mcqId: {
        type: Schema.Types.ObjectId,
        ref: "MCQ",
        required: true,
      },
      selectedOption: { type: String },
      correctAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  score: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  duration: { type: Number },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
});

const QuizAttempt: Model<IQuizAttempt> =
  mongoose.models.QuizAttempt ||
  mongoose.model<IQuizAttempt>("QuizAttempt", quizAttemptSchema);

export default QuizAttempt;
