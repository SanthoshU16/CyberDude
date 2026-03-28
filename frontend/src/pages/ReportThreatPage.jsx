import React, { useState } from "react";
import InputField from "../components/InputField";
import { reportThreat } from "../services/api";
import { ShieldAlert, AlertCircle, CheckCircle } from "lucide-react";
import "./CheckerPage.css";

const ReportThreatPage = () => {
  const [type, setType] = useState("domain");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleReport = async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Please provide the indicator to report.");
      return;
    }
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      await reportThreat(type, trimmed);
      setSuccess(true);
      setInput("");
    } catch (err) {
      const renderNote = window.location.hostname === "localhost" ? "" : " (Backend is running on Render, it takes some time to run like 1 or 2 minutes)";
      setError(
        err.response?.data?.detail ||
          "Failed to connect to the server. Is the backend running?" + renderNote
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checker-page">
      <div className="checker-header" style={{ borderLeftColor: "var(--cyber-red)" }}>
        <div className="checker-icon-wrap" style={{ borderColor: "var(--cyber-red)", color: "var(--cyber-red)", background: "rgba(255, 0, 60, 0.1)" }}>
          <ShieldAlert size={24} />
        </div>
        <div>
          <h2 className="checker-title" style={{ color: "var(--cyber-red)", textShadow: "0 0 5px rgba(255,0,60,0.5)"}}>Report Threat</h2>
          <p className="checker-subtitle">Submit malicious domains or emails to our community blocklist.</p>
        </div>
      </div>

      <div className="checker-form">
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          style={{
            background: "rgba(0, 255, 65, 0.05)",
            border: "1px solid var(--border-subtle)",
            color: "var(--cyber-green)",
            padding: "1rem",
            fontSize: "1rem",
            fontFamily: "'Share Tech Mono', monospace",
            outline: "none"
          }}
        >
          <option value="domain">Malicious Domain / URL</option>
          <option value="email">Phishing Email Address</option>
          <option value="sender">Spoofed Sender</option>
        </select>

        <InputField
          id="report-input"
          label="Threat Indicator"
          placeholder="e.g. badguy@spammer.com"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          icon={ShieldAlert}
        />

        {error && (
          <div className="checker-error" role="alert">
            <AlertCircle size={16} /><span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="checker-error" role="alert" style={{ background: "rgba(0, 255, 65, 0.1)", borderColor: "var(--cyber-green)", color: "var(--cyber-green)"}}>
            <CheckCircle size={16} /><span>Threat Successfully Reported and Logged.</span>
          </div>
        )}

        <button
          className="checker-btn"
          style={{ background: "var(--bg-dark)", color: "var(--cyber-red)", borderColor: "var(--cyber-red)", boxShadow: "inset 0 0 10px rgba(255, 0, 60, 0.2)" }}
          onClick={handleReport}
          disabled={loading || !input.trim()}
        >
          {loading ? <span className="spinner" /> : "Submit to Database"}
        </button>
      </div>
    </div>
  );
};
export default ReportThreatPage;
