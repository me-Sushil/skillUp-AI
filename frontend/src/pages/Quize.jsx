import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import service from "../services/service";

const Quize = () => {
  const { user } = useContext(AuthContext);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingScore, setSavingScore] = useState(false);

  const fetchQuizData = async () => {
    setLoading(true);
    try {
      const result = await service.quizeGet(user.id);
      console.log(result, "this is ai response");
      setQuizData(result.data);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);


const calculateScore = (answers) => {
  if (!answers || !quizData?.questions) return 0;
  let correct = 0;
  quizData.questions.forEach((q, index) => {
    if (answers[index] === q.correctAnswer) {
      correct++;
    }
  });
  return correct;
};

const saveQuizAttempt = async (score) => {
    setSavingScore(true);
    try {
       const transformedQuestions = quizData.questions.map((q) => ({
        question: q.question,
        options: q.options,
        correct: q.correctAnswer, // Already the index
      }));

      await service.saveQuizAttempt(user.id, transformedQuestions, score);
      
      console.log("Quiz attempt saved successfully");
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
      // You might want to show an error message to the user
    } finally {
      setSavingScore(false);
    }
  };
  
  const handleOptionSelect = (option) => {
    // Save the selected answer
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = option;
    setSelectedAnswers(newAnswers);

    // Automatically move to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < quizData.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
         // Last question, calculate score and save to database
        const finalScore = calculateScore(newAnswers);
        saveQuizAttempt(finalScore);
        setShowResults(true);
      }
    }, 300);
  };


  const resetQuiz = async () => {
    // Reset all states
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);

    // Fetch new quiz from backend
    await fetchQuizData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-white text-2xl">Loading quiz...</div>
        </div>
      </div>
    );
  }

  if (!quizData || !quizData.questions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
          <div className="text-white text-2xl mb-4">No quiz data available</div>
          <Link to="/dashboard">
            <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 text-white font-semibold">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-violet-400/10 to-fuchsia-400/10 animate-pulse z-0"></div>

      <div className="relative z-10 flex gap-x-7 p-3 h-screen overflow-hidden">
        <div className="bg-slate-800/80 w-full backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 relative overflow-hidden flex flex-col">

          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400"></div>

          {!showResults ? (
            <div className="flex-1 flex flex-col p-8 overflow-y-auto">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span className="font-medium">
                    Question {currentQuestion + 1} of{" "}
                    {quizData.questions.length}
                  </span>
                  <span className="font-medium">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Number Badge */}
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg">
                  Question {currentQuestion + 1}
                </div>
              </div>

              {/* Question */}
              <div className="bg-slate-900/50 rounded-xl p-3 mb-3 border border-slate-700/50 shadow-xl">
                <h3 className="text-2xl font-semibold text-white leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-1">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className="w-full text-left p-2 rounded-xl border-1 border-slate-700 bg-slate-900/30 hover:border-violet-400 hover:bg-violet-400/10 hover:shadow-lg hover:shadow-violet-400/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] group"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full border-2 border-slate-600 group-hover:border-violet-400 mr-4 flex items-center justify-center flex-shrink-0 transition-colors">
                        <span className="text-slate-400 group-hover:text-violet-400 font-bold transition-colors">
                          {String.fromCharCode(65 + index)}
                        </span>
                      </div>
                      <span className="text-slate-200 text-lg group-hover:text-white transition-colors">
                        {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Question Indicator Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {quizData.questions.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentQuestion
                        ? "w-8 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400"
                        : index < currentQuestion
                        ? "w-2 bg-violet-400"
                        : "w-2 bg-slate-700"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          ) : (
            // Results Screen
            <div className="flex-1 flex flex-col items-center justify-center p-2">
              <div className="bg-slate-900/50 rounded-2xl p-2 mt-1 border border-slate-700/50 max-w-2xl w-full shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-3 text-center">
                  Quiz Complete! 🎉
                </h2>
                 {savingScore && (
                  <div className="text-center mb-2">
                    <span className="text-violet-400 text-sm">Saving your score...</span>
                  </div>
                )}
                {/* Score Display */}

                <div className="bg-gradient-to-r from-cyan-400/20 via-violet-400/20 to-fuchsia-400/20 rounded-xl p-2 mb-2 border border-violet-400/30">
                  <div className="flex items-center justify-between gap-4">
                    {/* Score Display */}
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent whitespace-nowrap">
                        {calculateScore(selectedAnswers)}/{quizData.questions.length}

                      </p>
                      <p className="text-xl text-slate-300 font-medium whitespace-nowrap">
                        {Math.round(
                          (calculateScore(selectedAnswers) / quizData.questions.length) * 100
                        )}
                        % Score
                      </p>
                    </div>

                    {/* Message Display */}
                    <div>
                      {calculateScore(selectedAnswers) === quizData.questions.length && (
                        <p className="text-green-400 text-lg font-semibold whitespace-nowrap">
                          Perfect Score! 🌟
                        </p>
                      )}
                      {calculateScore(selectedAnswers) >= quizData.questions.length * 0.8 &&
                        calculateScore(selectedAnswers) < quizData.questions.length && (
                          <p className="text-blue-400 text-lg font-semibold whitespace-nowrap">
                            Great Job! 👏
                          </p>
                        )}
                      {calculateScore(selectedAnswers) >= quizData.questions.length * 0.6 &&
                        calculateScore(selectedAnswers) < quizData.questions.length * 0.8 && (
                          <p className="text-yellow-400 text-lg font-semibold whitespace-nowrap">
                            Good Effort! 💪
                          </p>
                        )}
                      {calculateScore(selectedAnswers) < quizData.questions.length * 0.6 && (
                        <p className="text-orange-400 text-lg font-semibold whitespace-nowrap">
                          Keep Practicing! 📚
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Answer Review  */}
                <div className="space-y-4 mb-1 overflow-y-auto custom-scrollbar max-h-96 pr-2">
                  <h3 className="text-xl font-semibold text-white mb-3 sticky top-0 bg-slate-900/50 backdrop-blur-sm py-2">
                    Answer Review:
                  </h3>
                  {quizData.questions.map((q, index) => (
                    <div
                      key={index}
                      className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50"
                    >
                      <p className="text-slate-300 mb-3 font-medium">
                        <span className="text-violet-400 font-bold">
                          Q{index + 1}:
                        </span>{" "}
                        {q.question}
                      </p>
                      <div className="mb-2">
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
                            selectedAnswers[index] === q.correctAnswer
                              ? "bg-green-500/20 text-green-400 border border-green-500/50"
                              : "bg-red-500/20 text-red-400 border border-red-500/50"
                          }`}
                        >
                          {selectedAnswers[index] === q.correctAnswer
                            ? "✓ Correct"
                            : "✗ Incorrect"}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <p className="text-slate-400">
                          Your answer:{" "}
                          <span
                            className={
                              selectedAnswers[index] === q.correctAnswer
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            {selectedAnswers[index]}
                          </span>
                        </p>
                        {selectedAnswers[index] !== q.correctAnswer && (
                          <p className="text-slate-400">
                            Correct answer:{" "}
                            <span className="text-green-400 font-semibold">
                              {q.correctAnswer}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4  justify-center">
                  <button
                    onClick={resetQuiz}
                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 text-white font-semibold hover:shadow-lg hover:shadow-violet-400/50 transition-all transform hover:scale-105 active:scale-95"
                  >
                    Retake Quiz
                  </button>
                  <Link to="/dashboard">
                    <button className="px-8 py-3 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-all transform hover:scale-105 active:scale-95">
                      Back to Dashboard
                    </button>
                  </Link>
                   <Link to="/stats">
                    <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 text-white font-semibold hover:shadow-lg hover:shadow-violet-400/50 transition-all transform hover:scale-105 active:scale-95">
                      Statistics
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quize;
