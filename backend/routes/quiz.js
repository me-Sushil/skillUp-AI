const express = require("express");
const router = express.Router();
require("dotenv").config();
const Quiz = require("../models/quiz");

router.post("/", async (req, res) => {
  try {
    const { userId, questions, score } = req.body;

    if (!userId || !questions || score === undefined) {
      return res.status(400).json({
        message: "Missing required fields: userId, questions, or score",
      });
    }

    // let quiz = await Quiz.findOne({ userId });
    // if (quiz) {
    //  User already has a quiz, add new attempt
    //   quiz.attempts.push({ score, date: new Date() });
    //   await quiz.save();
    //   res.status(200).json({
    //     message: "Quiz attempt added successfully",
    //     attempt: quiz.attempts[quiz.attempts.length - 1],
    //     isNewQuiz: false,
    //   });
    // } else {
    //  Create new quiz for user
    const newQuiz = new Quiz({
      userId,
      questions, //   Already transformed in frontend
      attempts: [{ score, date: new Date() }],
    });
    const result = await newQuiz.save();

    res.status(201).json({
      //   Use 201 for created
      message: "Quiz created successfully",
      attempt: result.attempts[0],
      isNewQuiz: true,
    });
    // }
  } catch (error) {
    console.error("Error saving quiz attempt:", error);
    res.status(500).json({
      message: "Error saving quiz attempt",
      error: error.message,
    });
  }
});

//  Get quiz stats for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("userId form backend to check quiz time", userId);
    
    const quizzes = await Quiz.find({ userId });

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: "No quiz found for this user" });
    }

    const allAttempts = quizzes.flatMap((q) => q.attempts);

    res.status(200).json({
      quizzes,
      totalAttempts: allAttempts.length,
      averageScore:
        allAttempts.reduce((sum, att) => sum + att.score, 0) /
        allAttempts.length,
      bestScore: Math.max(...allAttempts.map((att) => att.score)),
    });
  } catch (error) {
    console.error("Error fetching quiz history:", error);
    res.status(500).json({ message: "Error fetching quiz history" });
  }
});

module.exports = router;
