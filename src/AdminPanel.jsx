import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";

const base_url = "http://13.222.128.69:8085"; // Change this when deploying

export default function AdminPanel({ token }) {
  const [view, setView] = useState("dashboard"); // initial dashboard
  const [q, setQ] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    answer: "",
  });
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch questions when in post view
  useEffect(() => {
    if (view === "post") fetchQuestions();
  }, [view]);

  const fetchQuestions = async () => {
    try {
      let res = await axios.get(`${base_url}/api/exam/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data);
    } catch (e) {
      console.error("Failed to fetch questions", e);
    }
  };

  // Fetch results when in results view
  useEffect(() => {
    if (view === "results") fetchResults();
  }, [view]);

  const fetchResults = async () => {
    try {
      let res = await axios.get(`${base_url}/api/exam/results`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
    } catch (e) {
      console.error("Failed to fetch results", e);
    }
  };

  // Add or update question
  const saveQuestion = async () => {
    try {
      if (editingId) {
        await axios.put(`${base_url}/api/exam/update/${editingId}`, q, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Question updated");
        setEditingId(null);
      } else {
        await axios.post(`${base_url}/api/exam/add`, q, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Question added");
      }
      setQ({ question: "", optionA: "", optionB: "", optionC: "", optionD: "", answer: "" });
      fetchQuestions();
    } catch (e) {
      alert("❌ Operation failed");
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`${base_url}/api/exam/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Question deleted");
      fetchQuestions();
    } catch (e) {
      alert("❌ Delete failed");
    }
  };

  const startEdit = (ques) => {
    setQ({
      question: ques.question,
      optionA: ques.optionA,
      optionB: ques.optionB,
      optionC: ques.optionC,
      optionD: ques.optionD,
      answer: ques.answer,
    });
    setEditingId(ques.id);
  };

  // --- Render ---

  // Dashboard
  if (view === "dashboard") {
    return (
      <div className="dashboard-screen">
        <h2>Admin Panel</h2>
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
            transition: "transform 0.3s, boxShadow 0.3s",
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
            Welcome Admin👋
          </h2>
          <p style={{ fontSize: "18px", color: "#333", lineHeight: "1.7", margin: "0 20px" }}>
            You are now logged into the Admin Dashboard. Manage users, create or update exams, and monitor results efficiently. Keep the platform running smoothly.
          </p>
        </div>
        <div className="dashboard-buttons">
          <button onClick={() => setView("post")}>Post Question</button>
          <button onClick={() => setView("results")}>See Results</button>
        </div>
      </div>
    );
  }

  // Post Question view
  if (view === "post") {
    return (
      <div className="admin-container">
        <button className="back-btn" onClick={() => setView("dashboard")}>Back</button>

        <div className="form-card">
          <h3>{editingId ? "Edit Question" : "Add New Question"}</h3>
          <input placeholder="Question" value={q.question} onChange={e => setQ({ ...q, question: e.target.value })}/>
          <input placeholder="Option A" value={q.optionA} onChange={e => setQ({ ...q, optionA: e.target.value })}/>
          <input placeholder="Option B" value={q.optionB} onChange={e => setQ({ ...q, optionB: e.target.value })}/>
          <input placeholder="Option C" value={q.optionC} onChange={e => setQ({ ...q, optionC: e.target.value })}/>
          <input placeholder="Option D" value={q.optionD} onChange={e => setQ({ ...q, optionD: e.target.value })}/>
          <input placeholder="Correct Answer" value={q.answer} onChange={e => setQ({ ...q, answer: e.target.value })}/>
          <div className="btn-group">
            <button onClick={saveQuestion}>{editingId ? "💾 Update" : "➕ Add"}</button>
            {editingId && <button className="cancel-btn" onClick={() => { setEditingId(null); setQ({ question: "", optionA: "", optionB: "", optionC: "", optionD: "", answer: "" }); }}>❌ Cancel</button>}
          </div>
        </div>

        <div className="list-card">
          <h3>Posted Questions</h3>
          {questions.length === 0 ? <p>No questions posted yet.</p> : (
            <ul>
              {questions.map(ques => (
                <li key={ques.id} className="question-item">
                  <div>
                    <b>Q:</b> {ques.question}
                    <div className="options-list">
                      <span>A. {ques.optionA}</span>
                      <span>B. {ques.optionB}</span>
                      <span>C. {ques.optionC}</span>
                      <span>D. {ques.optionD}</span>
                    </div>
                    <b>Answer:</b> {ques.answer}
                  </div>
                  <div className="btn-group">
                    <button className="edit-btn" onClick={() => startEdit(ques)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteQuestion(ques.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // Results view
  if (view === "results") {
    return (
      <div className="results-container">
        <button className="back-btn" onClick={() => setView("dashboard")}>Back</button>
        <h2>User Results</h2>
        {results.length === 0 ? <p>No results available.</p> : (
          <table className="results-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Attempted</th>
                <th>Total Questions</th>
                <th>Correct</th>
                <th>Percentage</th>
                <th>Time Taken (s)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td>{r.username}</td>
                  <td>{r.attempted}</td>
                  <td>{r.totalQuestions}</td>
                  <td>{r.correctAnswers}</td>
                  <td>{r.percentage}%</td>
                  <td>{r.timeTaken}</td>
                  <td>{new Date(r.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
