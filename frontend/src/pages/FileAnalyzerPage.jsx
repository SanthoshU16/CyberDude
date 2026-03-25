import React, { useState } from "react";
import InputField from "../components/InputField";
import ResultCard from "../components/ResultCard";
import { analyzeFile } from "../services/api";
import { FileWarning, Search, AlertCircle } from "lucide-react";
import "./CheckerPage.css";

const FileAnalyzerPage = ({ onScan, initialQuery, clearQuery }) => {
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
      setError("Please enter a filename or extension to analyze.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const response = await analyzeFile(trimmed);
      const data = response.data;
      
      const customResult = {
        status: data.status,
        message: data.message,
        confidence_score: data.risk_score,
        matched_domain: "Threat Level"
      };

      setResult(customResult);
      if (onScan) onScan(trimmed, data.status);
    } catch (err) {
      setError("Failed to analyze file payload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checker-page">
      <div className="checker-header">
        <div className="checker-icon-wrap checker-icon-wrap--domain">
          <FileWarning size={24} />
        </div>
        <div>
          <h2 className="checker-title">Payload Analyzer</h2>
          <p className="checker-subtitle">Simulate analyzing file extensions for malware probability.</p>
        </div>
      </div>

      <div className="checker-form">
        <InputField
          id="file-input"
          label="File Name"
          placeholder="e.g. invoice.pdf.exe or payment.zip"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onClear={() => { setInput(""); setResult(null); setError(""); }}
          icon={FileWarning}
        />

        {error && (
          <div className="checker-error" role="alert">
            <AlertCircle size={16} /><span>{error}</span>
          </div>
        )}

        <button
          className="checker-btn checker-btn--domain"
          onClick={() => handleCheck(input)}
          disabled={loading || !input.trim()}
        >
          {loading ? <span className="spinner" /> : <><Search size={16} /> Analyze File</>}
        </button>
      </div>

      {result && <ResultCard result={result} type="domain" />}
    </div>
  );
};
export default FileAnalyzerPage;
