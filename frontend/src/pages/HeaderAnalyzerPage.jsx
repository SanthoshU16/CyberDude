import React, { useState } from "react";
import InputField from "../components/InputField";
import ResultCard from "../components/ResultCard";
import { checkHeaders } from "../services/api";
import { Code, Search, AlertCircle } from "lucide-react";
import "./CheckerPage.css";

const HeaderAnalyzerPage = ({ onScan, initialQuery, clearQuery }) => {
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

  const handleCheck = async (passedInput) => {
    const trimmed = (passedInput || input).trim();
    if (!trimmed) {
      setError("Please paste raw email headers.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const response = await checkHeaders(trimmed);
      const data = response.data;
      
      const customResult = {
        status: data.status,
        message: "Header scan complete. " + (data.notes.length > 0 ? data.notes.join(" ") : "All authentications verified."),
        matched_keywords: [`SPF: ${data.spf}`, `DKIM: ${data.dkim}`, `DMARC: ${data.dmarc}`]
      };

      setResult(customResult);
      if (onScan) onScan("Headers", data.status);
    } catch (err) {
      setError("Failed to parse raw headers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checker-page">
      <div className="checker-header">
        <div className="checker-icon-wrap checker-icon-wrap--domain" style={{ color: "var(--cyber-pink)", borderColor: "var(--cyber-pink)", background: "rgba(255, 0, 255, 0.1)" }}>
          <Code size={24} />
        </div>
        <div>
          <h2 className="checker-title" style={{ color: "var(--cyber-pink)", textShadow: "0 0 5px rgba(255, 0, 255, 0.5)"}}>Header Analyzer</h2>
          <p className="checker-subtitle">Analyze raw MIME headers for spoofing via SPF/DKIM/DMARC.</p>
        </div>
      </div>

      <div className="checker-form">
        <textarea
          className="input-field"
          style={{ 
            height: "150px", 
            border: "1px solid var(--border-subtle)", 
            background: "rgba(0, 255, 65, 0.02)",
            resize: "vertical",
            padding: "1rem",
            color: "var(--cyber-green)",
            outline: "none",
            fontFamily: "'JetBrains Mono', monospace"
          }}
          placeholder="Paste raw email headers here... e.g. 'Authentication-Results: spf=pass...'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {error && (
          <div className="checker-error" role="alert">
            <AlertCircle size={16} /><span>{error}</span>
          </div>
        )}

        <button
          className="checker-btn"
          style={{ borderColor: "var(--cyber-pink)", color: "var(--cyber-pink)" }}
          onClick={handleCheck}
          disabled={loading || !input.trim()}
        >
          {loading ? <span className="spinner" /> : <><Search size={16} /> Decrypt Headers</>}
        </button>
      </div>

      {result && <ResultCard result={result} type="email" />}
    </div>
  );
};
export default HeaderAnalyzerPage;
