import { Clock, Trash2, PanelLeftClose, Plus } from "lucide-react";
import "./HistoryPanel.css";

const HistoryPanel = ({ history, onClear, onItemClick, onDeleteItem, onToggleSidebar, onNewScan }) => {
  const getDisplayTitle = (text, type) => {
    if (!text) return "Untitled Scan";
    // For headers/payloads, they can be very long. Truncate them.
    const cleanText = text.replace(/[\n\r]/g, " ").trim();
    if (cleanText.length > 50) {
      return cleanText.substring(0, 47) + "...";
    }
    return cleanText;
  };

  return (
    <aside className="history-panel">
      <div className="panel-top-actions">
        <button className="history-toggle-btn" onClick={onToggleSidebar} title="Hide Sidebar">
          <PanelLeftClose size={22} />
        </button>
      </div>

      <button className="new-scan-btn" onClick={onNewScan}>
        <Plus size={20} />
        <span>NEW SCAN</span>
      </button>

      <div className="history-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
          <Clock size={20} className="history-icon" />
          <h3 className="history-title">Recent Scans</h3>
        </div>
      </div>
      
      {history.length === 0 ? (
        <div className="history-empty">No scans yet. Try analysing a domain or email.</div>
      ) : (
        <>
          <div className="history-list">
            {history.map((item, index) => (
              <div 
                key={index}
                className={`history-item history-item--${item.status} ${onItemClick ? 'history-item-clickable' : ''}`}
                onClick={() => onItemClick && onItemClick(item)}
              >
                <div className="history-item-body">
                  <div className="history-meta">
                    <span className="history-type-badge">{item.type}</span>
                    <span>{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className="history-content" title={item.input}>
                    {getDisplayTitle(item.input, item.type)}
                  </div>
                </div>
                <button 
                  className="history-item-delete" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDeleteItem) onDeleteItem(index);
                  }}
                  title="Delete item"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          <button className="history-clear-btn" onClick={onClear}>
            <Trash2 size={14} style={{ display: "inline", verticalAlign: "bottom", marginRight: "6px" }} />
            Clear All History
          </button>
        </>
      )}
    </aside>
  );
};

export default HistoryPanel;
