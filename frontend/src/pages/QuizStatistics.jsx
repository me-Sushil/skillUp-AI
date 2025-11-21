import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import service from "../services/service";

const QuizStatistics = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuizStats = async () => {
    setLoading(true);
    try {
      console.log(user, "this is user in quizStat to check");

      const result = await service.getQuizStats(user.id);
      console.log(result.data, "quiz statistics");
      setStats(result.data);
    } catch (error) {
      console.error("Error fetching quiz stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-white text-2xl">Loading statistics...</div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
          <div className="text-white text-2xl mb-4">
            No quiz statistics available
          </div>
          <Link to="/dashboard">
            <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 text-white font-semibold">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-violet-400/10 to-fuchsia-400/10 animate-pulse z-0"></div>

      <div className="relative z-10 flex gap-x-7 p-3 h-screen overflow-hidden">
        <div className="bg-slate-800/80 max-w-2xl mx-auto w-full backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400"></div>

          <div className="flex-1 flex flex-col p-8 overflow-y-auto">
            {/* Statistics Summary */}

            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Quiz Statistics
              </h2>

              {/* Horizontal stats row */}
              <div className="flex justify-center gap-12 text-white/80 text-lg font-medium">
                <div>
                  <div className="text-sm">Total Attempts</div>
                  <div className="text-white font-semibold">
                    {stats.totalAttempts}
                  </div>
                </div>
                <div>
                  <div className="text-sm">Average Score</div>
                  <div className="text-white font-semibold">
                    {Math.round(stats.averageScore * 100) / 100}
                  </div>
                </div>
                <div>
                  <div className="text-sm">Best Score</div>
                  <div className="text-white font-semibold">
                    {stats.bestScore}
                  </div>
                </div>
              </div>
            </div>

            {/* Attempt Review */}
            <div className="space-y-4 overflow-y-auto custom-scrollbar max-h-[60vh] pr-2">
              {stats.quizzes.map((quiz, qIndex) => (
                <div
                  key={qIndex}
                  className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50"
                >
                  <p className="text-violet-400 font-bold mb-2">
                    Quiz {qIndex + 1}
                  </p>
                  {quiz.attempts.map((att, index) => (
                    <div
                      key={index}
                      className="bg-slate-900/50 rounded-lg p-2 mb-2 border border-slate-700/50 flex justify-between items-center"
                    >
                      <span className="text-slate-300 font-medium">
                        - Score:{" "}
                        <span className="text-cyan-400 font-bold">
                          {att.score}
                        </span>
                      </span>
                      <span className="text-slate-400 text-sm">
                        {new Date(att.date).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {quiz.questions.map((q, index) => (
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

                      <div className="text-sm space-y-1">
                        <p className="text-slate-400">
                          Correct answer:{" "}
                          <span className="text-green-400 font-semibold">
                            {q.correct}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Back Button */}
            <div className="flex justify-center mt-4">
              <Link to="/dashboard">
                <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 text-white font-semibold hover:shadow-lg hover:shadow-violet-400/50 transition-all transform hover:scale-105 active:scale-95">
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizStatistics;
