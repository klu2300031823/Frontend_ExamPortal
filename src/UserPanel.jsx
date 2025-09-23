import { useState, useEffect } from "react";
import axios from "axios";
import "./UserPanel.css";

const base_url = "http://3.88.1.8:8085"; // Change this URL when deploying

export default function UserPanel({ token }) {
  const username = localStorage.getItem("username");

  // 🔹 Load saved state (if exam in progress)
  const saved = JSON.parse(localStorage.getItem("examState")) || {};

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(saved.answers || {});
  const [score, setScore] = useState(null);
  const [started, setStarted] = useState(saved.started || false);
  const [currentIndex, setCurrentIndex] = useState(saved.currentIndex || 0);
  const [timeLeft, setTimeLeft] = useState(saved.timeLeft !== undefined ? saved.timeLeft : 600);
  const [view, setView] = useState(saved.view || "dashboard");
  const [history, setHistory] = useState([]);

  // 🔹 Save progress in localStorage
  useEffect(() => {
    if (started && view === "exam") {
      localStorage.setItem(
        "examState",
        JSON.stringify({ answers, currentIndex, timeLeft, started, view })
      );
    }
  }, [answers, currentIndex, timeLeft, started, view]);

  // 🔹 Fetch questions when exam starts
  useEffect(() => {
    if (started && questions.length === 0) {
      axios
        .get(`${base_url}/api/exam/questions`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (!res.data || res.data.length === 0) {
            alert("❌ No questions available for this test.");
            setStarted(false);
            setView("dashboard");
            localStorage.removeItem("examState");
          } else {
            setQuestions(res.data);
          }
        })
        .catch((err) => {
          console.error(err);
          alert("⚠ Failed to load questions. Please try again.");
          setStarted(false);
          setView("dashboard");
          localStorage.removeItem("examState");
        });
    }
  }, [started, questions.length, token]);

  // 🔹 Timer
  useEffect(() => {
    if (!started || score !== null || view !== "exam") return;
    if (timeLeft <= 0) {
      submitExam();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, started, score, view]);

  // 🔹 Fetch user history
  useEffect(() => {
    if (view === "history") {
      axios
        .get(`${base_url}/api/exam/results/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setHistory(res.data))
        .catch((err) => console.error(err));
    }
  }, [view, username, token]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const submitExam = async () => {
    const timeTaken = 600 - timeLeft;
    const data = { username, answers, timeTaken };

    try {
      const res = await axios.post(
        `${base_url}/api/exam/submit`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setScore(res.data.percentage);
      setView("result");
      setStarted(false);
      localStorage.removeItem("examState"); // ✅ clear saved state
    } catch (e) {
      alert("❌ Submission failed");
    }
  };

  // --- Render ---

  // 🔹 Dashboard
  if (view === "dashboard") {
    return (
      <div className="dashboard-screen">
        <h2>User Exam Dashboard</h2>
        <div 
          style={{
            padding: "30px",
            margin: "30px auto",
            textAlign: "center",
            maxWidth: "750px",
            background: "linear-gradient(135deg, #6dd5fa, #ffffff)",
            borderRadius: "15px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            borderTop: "5px solid #2196f3",
            transition: "transform 0.3s, box-shadow 0.3s",
            cursor: "default"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
          }}
        >
          <h2 style={{ fontSize: "32px", color: "#0d47a1", marginBottom: "15px", fontWeight: "700" }}>
            Welcome, {username} 👋
          </h2>
          <p style={{ fontSize: "18px", color: "#333", lineHeight: "1.7", margin: "0 20px" }}>
            You are now logged into your User Dashboard. Take your exams, track your progress, and view 
            your history. Complete your tests within the allotted time to achieve your best results. Good luck!
          </p>
        </div>

        <div className="dashboard-buttons">
          <button
            onClick={() => {
              setAnswers({});
              setScore(null);
              setQuestions([]);
              setCurrentIndex(0);
              setTimeLeft(600);
              setStarted(true);
              setView("exam");
              localStorage.removeItem("examState");
            }}
          >
            Test To Be Taken
          </button>
          <button onClick={() => setView("history")}>Tests Taken</button>
        </div>
      </div>
    );
  }

  // 🔹 Exam screen
  if (view === "exam") {
    if (questions.length === 0) {
      return (
        <div className="userpanel-container">
          <div className="exam-header">
            <span>User Exam</span>
          </div>
          <div className="no-questions">
            <p>No questions available for this test.</p>
            <button
              onClick={() => {
                setStarted(false);
                setView("dashboard");
                localStorage.removeItem("examState");
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    const currentQ = questions[currentIndex];

    return (
      <div className="userpanel-container">
        <div className="exam-header">
          <span>User Exam</span>
          <span className="timer">{formatTime(timeLeft)}</span>
        </div>

        <div className="progress-bar">
          <div style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
        </div>

        {currentQ && (
          <div className="question-card" key={currentQ.id}>
            <p className="question-text">{currentQ.question}</p>
            <div className="options">
              {["optionA", "optionB", "optionC", "optionD"].map((opt) => (
                <label
                  key={opt}
                  className={answers[currentQ.id] === currentQ[opt] ? "selected" : ""}
                >
                  <input
                    type="radio"
                    name={currentQ.id}
                    value={currentQ[opt]}
                    checked={answers[currentQ.id] === currentQ[opt]}
                    onChange={(e) =>
                      setAnswers({ ...answers, [currentQ.id]: e.target.value })
                    }
                  />
                  {currentQ[opt]}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="nav-buttons">
          {currentIndex > 0 && (
            <button onClick={() => setCurrentIndex(currentIndex - 1)}>Prev</button>
          )}
          {currentIndex < questions.length - 1 ? (
            <button onClick={() => setCurrentIndex(currentIndex + 1)}>Next</button>
          ) : (
            <button onClick={submitExam}>Submit</button>
          )}
        </div>
      </div>
    );
  }

  // 🔹 Result screen
  if (view === "result") {
    return (
      <div className="result-screen">
        <h2 className={score >= 30 ? "pass" : "fail"}>Final Score: {score}%</h2>
        <button
          onClick={() => {
            setAnswers({});
            setQuestions([]);
            setCurrentIndex(0);
            setTimeLeft(600);
            setScore(null);
            setStarted(false);
            setView("dashboard");
            localStorage.removeItem("examState");
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  // 🔹 History screen
  if (view === "history") {
    return (
      <div className="tests-screen">
        <h2>Tests Taken</h2>
        {history.length === 0 ? (
          <p>No tests taken yet.</p>
        ) : (
          <div className="tests-list">
            {history.map((h, i) => (
              <div key={i} className="test-item">
                <span>{new Date(h.date).toLocaleString()}</span>
                <span className={`test-score ${h.percentage >= 30 ? "pass" : "fail"}`}>
                  {h.percentage}%
                </span>
              </div>
            ))}
          </div>
        )}
        <button className="tests-back-btn" onClick={() => setView("dashboard")}>
          Back
        </button>
      </div>
    );
  }
}
