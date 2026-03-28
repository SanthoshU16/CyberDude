import React, { useState, useRef } from "react";
import InputField from "../components/InputField";
import ResultCard from "../components/ResultCard";
import { checkDomain } from "../services/api";
import { Globe, Search, AlertCircle } from "lucide-react";
import "./CheckerPage.css";

const debounce = (fn, delay) => {
  //...
};

const DomainCheckerPage = ({ onScan, initialQuery, clearQuery }) => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
      handleCheck(initialQuery);
      if (clearQuery) clearQuery();
    }
  }, [initialQuery]);

  const handleCheck = async (value) => {
    let trimmed = (value || input).trim();
    if (!trimmed) {
      setError("Please enter a domain or URL to analyse.");
      return;
    }
    
    // Auto-extract domain if user pastes a full URL
    try {
      if (trimmed.startsWith("http")) {
        const url = new URL(trimmed);
        trimmed = url.hostname;
      }
    } catch (e) {
      // ignore invalid URL
    }

    setError("");
    setLoading(true);
    setResult(null);
    
    try {
      const response = await checkDomain(trimmed);
      setResult(response.data);
      if (onScan) onScan(trimmed, response.data.status);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const renderNote = window.location.hostname === "localhost" ? "" : " (Backend is running on Render, it takes some time to run like 1 or 2 minutes)";
      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Validation error.");
      } else {
        setError(
          detail ||
            err.response?.data?.message ||
            "Failed to connect to the server. Is the backend running?" + renderNote
        );
      }
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

  return (
    <div className="checker-page">
      <div className="checker-header">
        <div className="checker-icon-wrap checker-icon-wrap--domain">
          <Globe size={24} />
        </div>
        <div>
          <h2 className="checker-title">Domain Phishing Detector</h2>
          <p className="checker-subtitle">
            Enter a domain or URL to check for typosquatting and spoofing.
          </p>
        </div>
      </div>

      <div className="checker-form">
        <InputField
          id="domain-input"
          label="Domain / URL"
          placeholder="e.g. g00gle.com or paypa1.com"
          value={input}
          onChange={handleChange}
          onClear={() => { setInput(""); setResult(null); setError(""); }}
          icon={Globe}
        />

        {error && (
          <div className="checker-error" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          id="domain-check-btn"
          className="checker-btn checker-btn--domain"
          onClick={() => handleCheck(input)}
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <span className="spinner" />
          ) : (
            <>
              <Search size={16} />
              Analyse Domain
            </>
          )}
        </button>
      </div>

      {result && <ResultCard result={result} type="domain" />}
    </div>
  );
};

export default DomainCheckerPage;
