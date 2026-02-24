import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function CreatePassage() {
  const [questions, setQuestions] = useState([
    { number: 1, text: "", answer: "", data: "" }
  ]);

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { number: prev.length + 1, text: "", answer: "", data: "" }
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    questions.forEach((q, i) => {
      formData.append(`questions[${i}][number]`, q.number);
      formData.append(`questions[${i}][text]`, q.text);
      formData.append(`questions[${i}][answer]`, q.answer);
      formData.append(`questions[${i}][data]`, q.data);
    });

    fetch("/create-passage", {
      method: "POST",
      body: formData
    });
  };

  return (
    <main className="content">
      <div style={styles.container}>
        <h2>Create New Passage</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div style={styles.grid}>
            <div>
              <label>Test Designation:</label>
              <select name="testDesignation" required style={styles.input}>
                <option value="true">Main Test</option>
                <option value="false">Practice Test</option>
              </select>
            </div>

            <div>
              <label>Test Type:</label>
              <select name="testType" required style={styles.input}>
                <option value="1">1 (Multiple Choice)</option>
                <option value="2">2 (True / False / Not Given)</option>
                <option value="3">3 (Yes / No / Not Given)</option>
                <option value="4">4 (Matching Information)</option>
                <option value="5">5 (Matching Headings)</option>
                <option value="6">6 (Matching Features)</option>
                <option value="7">7 (Matching Sentence Endings)</option>
                <option value="8">8 (Sentence Completion)</option>
                <option value="9">9 (Summary Completion)</option>
                <option value="10">10 (Diagram-Label Completion)</option>
                <option value="11">11 (Short-Answer Questions)</option>
              </select>
            </div>
          </div>

          <div style={styles.block}>
            <label>Passage Title:</label>
            <input name="passageTitle" required style={styles.input} />
          </div>

          <div style={styles.block}>
            <label>Passage Content (HTML allowed):</label>
            <textarea name="passage" rows="10" required style={styles.input} />
          </div>

          <div style={styles.block}>
            <label>Passage Source (Optional):</label>
            <input name="passageSource" style={styles.input} />
          </div>

          <div style={styles.uploadBox}>
            <label><strong>Add Diagram/Image (Optional):</strong></label>
            <input type="file" name="passageImage" accept="image/*" />
            <small style={{ color: "#666" }}>
              This image will appear between the title and the passage text.
            </small>
          </div>

          <hr />

          <h3>Questions</h3>

          {questions.map((q, i) => (
            <div key={i} style={styles.questionBox}>
              <label>Q#:</label>
              <input
                type="number"
                value={q.number}
                style={{ width: 50 }}
                onChange={e => handleQuestionChange(i, "number", e.target.value)}
              />

              <label>Question Text:</label>
              <input
                type="text"
                value={q.text}
                style={{ width: "60%" }}
                onChange={e => handleQuestionChange(i, "text", e.target.value)}
              />

              <div style={{ marginTop: 10 }}>
                <label>Correct Answer:</label>
                <input
                  value={q.answer}
                  onChange={e => handleQuestionChange(i, "answer", e.target.value)}
                />

                <label>Options (CSV for MCQs):</label>
                <input
                  value={q.data}
                  placeholder="Choice A, Choice B, Choice C"
                  onChange={e => handleQuestionChange(i, "data", e.target.value)}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            style={styles.secondaryBtn}
          >
            + Add Another Question
          </button>

          <div style={styles.submitBox}>
            <button type="submit" style={styles.primaryBtn}>
              Save Passage to Database
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: "40px auto",
    background: "#fff",
    padding: 30,
    borderRadius: 10,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginBottom: 20
  },
  block: { marginBottom: 20 },
  input: { width: "100%", padding: 8 },
  uploadBox: {
    marginBottom: 20,
    padding: 15,
    border: "1px dashed #007bff",
    borderRadius: 8
  },
  questionBox: {
    border: "1px solid #eee",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5
  },
  secondaryBtn: {
    background: "#6c757d",
    color: "#fff",
    padding: 10,
    border: "none",
    cursor: "pointer"
  },
  submitBox: {
    marginTop: 30,
    borderTop: "2px solid #eee",
    paddingTop: 20
  },
  primaryBtn: {
    background: "#28a745",
    color: "#fff",
    padding: "15px 40px",
    border: "none",
    width: "100%",
    fontSize: "1.1em",
    cursor: "pointer"
  }
};
