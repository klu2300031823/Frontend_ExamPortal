import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Welcome to Online Exam Portal</h1>
          <p>
            Your one-stop solution for secure, smart, and interactive online exams.
            Take tests, track your performance, and grow your skills.
          </p>
          <a href="#features" className="cta-btn">Get Started</a>
        </div>
        <div className="hero-img">
          <img
            src="https://img.freepik.com/free-vector/online-exams-concept-illustration_114360-4767.jpg"
            alt="Online Exam Illustration"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Why Choose Us?</h2>
        <div className="card-container">
          <div className="card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Easy Access"
            />
            <h3>Easy Access</h3>
            <p>Login and start exams from anywhere, anytime with secure authentication.</p>
          </div>
          <div className="card">
            <img
              src="https://img.freepik.com/free-vector/business-report-concept-illustration_114360-1495.jpg"
              alt="Track Progress"
            />
            <h3>Track Progress</h3>
            <p>View instant results and analyze your performance with smart insights.</p>
          </div>
          <div className="card">
            <img
              src="https://img.freepik.com/free-vector/real-time-analytics-concept-illustration_114360-902.jpg"
              alt="Real-Time Results"
            />
            <h3>Real-Time Results</h3>
            <p>Get accurate, real-time evaluation the moment you finish your exam.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Online Exam Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}
