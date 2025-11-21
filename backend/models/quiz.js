const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const quizSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Array of questions
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
        required: true,
      },
      correct: {
        type: String,
        required: true,
      },
    },
  ],

  // Array of attempts
  attempts: [
    {
      score: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Quiz", quizSchema);

