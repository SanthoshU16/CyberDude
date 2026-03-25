import React from "react";
import "./ResultCard.css";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  AlertTriangle,
} from "lucide-react";

const STATUS_CONFIG = {
  safe: {
    icon: ShieldCheck,
    label: "Safe",
    color: "safe",
    barColor: "#10b981",
  },
  warning: {
    icon: ShieldAlert,
    label: "Warning",
    color: "warning",
    barColor: "#ef4444",
  },
  suspicious: {
    icon: AlertTriangle,
    label: "Suspicious",
    color: "suspicious",
    barColor: "#f59e0b",
  },
  unknown: {
    icon: ShieldQuestion,
    label: "Unknown",
    color: "unknown",
    barColor: "#94a3b8",
  },
};

const ResultCard = ({ result, type }) => {
  if (!result) return null;

  const status = result.status;
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
  const Icon = config.icon;

  const isDomain = type === "domain";
  const isEmail = type === "email";

  return (
    <div className={`result-card result-card--${config.color}`}>
      <div className="result-card__header">
        <div className={`result-icon result-icon--${config.color}`}>
          <Icon size={22} />
        </div>
        <div>
          <p className="result-status-label">Detection Result</p>
          <h3 className={`result-status result-status--${config.color}`}>
            {config.label}
          </h3>
        </div>
      </div>

      {isEmail && result.message && (
        <p className="result-message">{result.message}</p>
      )}

      {isEmail && result.matched_keywords?.length > 0 && (
        <div className="result-keywords">
          <p className="result-keywords__title">Phishing Keywords Detected</p>
          <div className="result-keywords__list">
            {result.matched_keywords.map((kw) => (
              <span key={kw} className="keyword-badge">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {isDomain && (
        <>
          {result.matched_domain && (
            <p className="result-domain-match">
              <span className="result-match-label">Similar to:</span>{" "}
              <strong>{result.matched_domain}</strong>
            </p>
          )}
          <div className="result-score-section">
            <div className="result-score-header">
              <span className="result-score-label">Confidence Score</span>
              <span
                className="result-score-value"
                style={{ color: config.barColor }}
              >
                {result.confidence_score}%
              </span>
            </div>
            <div className="result-progress-track">
              <div
                className="result-progress-fill"
                style={{
                  width: `${result.confidence_score}%`,
                  background: config.barColor,
                  boxShadow: `0 0 10px ${config.barColor}80`,
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResultCard;
