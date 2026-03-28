import React, { useState, useCallback, useRef, useEffect } from "react";
import InputField from "../components/InputField";
import ResultCard from "../components/ResultCard";
import { checkEmail } from "../services/api";
import { Mail, Search, AlertCircle } from "lucide-react";
import "./CheckerPage.css";

const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const EmailCheckerPage = ({ onScan, initialQuery, clearQuery }) => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
      handleCheck(initialQuery);
      if (clearQuery) clearQuery();
    }
  }, [initialQuery]);

  const handleCheck = async (value) => {
    const trimmed = (value || input).trim();
    if (!trimmed) {
      setError("Please enter some email content to analyse.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const response = await checkEmail(trimmed);
      setResult(response.data);
      if (onScan) onScan(trimmed, response.data.status);
    } catch (err) {
      const renderNote = window.location.hostname === "localhost" ? "" : " (Backend is running on Render, it takes some time to run like 1 or 2 minutes)";
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to connect to the server. Is the backend running?" + renderNote;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const debouncedRef = useRef(debounce(handleCheck, 600));

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    if (result) setResult(null);
    if (error) setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      debouncedRef.current.flush?.();
      handleCheck(input);
    }
  };

  return (
    <div className="checker-page">
      <div className="checker-header">
        <div className="checker-icon-wrap checker-icon-wrap--email">
          <Mail size={24} />
        </div>
        <div>
          <h2 className="checker-title">Email Phishing Detector</h2>
          <p className="checker-subtitle">
            Paste email content below to detect phishing indicators.
          </p>
        </div>
      </div>

      <div className="checker-form">
        <InputField
          id="email-input"
          label="Email Content"
          placeholder="Paste email body here (e.g. 'Please verify your bank password urgently…')"
          value={input}
          onChange={handleChange}
          onClear={() => { setInput(""); setResult(null); setError(""); }}
          icon={Mail}
        />

        {error && (
          <div className="checker-error" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          id="email-check-btn"
          className="checker-btn checker-btn--email"
          onClick={() => handleCheck(input)}
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <span className="spinner" />
          ) : (
            <>
              <Search size={16} />
              Analyse Email
            </>
          )}
        </button>
      </div>

      {result && <ResultCard result={result} type="email" />}
    </div>
  );
};

export default EmailCheckerPage;
