import React, { useState } from "react";
import InputField from "../components/InputField";
import ResultCard from "../components/ResultCard";
import { checkBreach } from "../services/api";
import { Unlock, Search, AlertCircle, Database } from "lucide-react";
import "./CheckerPage.css";

const BreachCheckerPage = ({ onScan, initialQuery, clearQuery }) => {
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
    const trimmed = (value || input).trim();
    if (!trimmed) {
      setError("Please enter an email to check for breaches.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const response = await checkBreach(trimmed);
      const data = response.data;
      
      const customResult = {
        status: data.status,
        message: data.breach_count > 0 
          ? `WARNING: This email has been involved in ${data.breach_count} known data breach(es).` 
          : "Safe! This email was not found in any public data breaches.",
        matched_keywords: data.breaches?.map(b => `${b.name} (${b.date})`) || []
      };

      setResult(customResult);
      if (onScan) onScan(trimmed, data.status);
    } catch (err) {
      setError("Failed to query breach database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checker-page">
      <div className="checker-header">
        <div className="checker-icon-wrap checker-icon-wrap--email">
          <Database size={24} />
        </div>
        <div>
          <h2 className="checker-title">Data Breach Scanner</h2>
          <p className="checker-subtitle">Check if your email has been compromised in known data leaks.</p>
        </div>
      </div>

      <div className="checker-form">
        <InputField
          id="breach-input"
          label="Email Address"
          placeholder="e.g. user@example.com"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onClear={() => { setInput(""); setResult(null); setError(""); }}
          icon={Unlock}
        />

        {error && (
          <div className="checker-error" role="alert">
            <AlertCircle size={16} /><span>{error}</span>
          </div>
        )}

        <button
          className="checker-btn checker-btn--email"
          onClick={() => handleCheck(input)}
          disabled={loading || !input.trim()}
        >
          {loading ? <span className="spinner" /> : <><Search size={16} /> Query Database</>}
        </button>
      </div>

      {result && <ResultCard result={result} type="email" />}
    </div>
  );
};
export default BreachCheckerPage;
