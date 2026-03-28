import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HistoryPanel from "./components/HistoryPanel";
import EmailCheckerPage from "./pages/EmailCheckerPage";
import DomainCheckerPage from "./pages/DomainCheckerPage";
import MatrixBackground from "./components/MatrixBackground";
import { Mail, Globe, Shield, PanelLeft } from "lucide-react";
import "./App.css";

const TABS = [
  { id: "domain", label: "Domain Scanner", icon: Globe },
  { id: "email", label: "Email Scanner", icon: Mail },
];

function App() {
  const [tab, setTab] = useState("domain");
  const [showSidebar, setShowSidebar] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("cyberdude_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cyberdude_history", JSON.stringify(history));
  }, [history]);

  const handleScan = (type, input, status) => {
    setHistory((prev) => {
      const newScan = { type, input, status, timestamp: new Date().toISOString() };
      return [newScan, ...prev].slice(0, 15);
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleDeleteHistoryItem = (index) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  };

  const [activeQuery, setActiveQuery] = useState(null);
  
  const handleHistoryClick = (item) => {
    const map = {
      "Domain": "domain", "Email": "email"
    };
    const targetTab = map[item.type];
    if (targetTab) {
      setTab(targetTab);
      setActiveQuery(item.input);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const [refreshKey, setRefreshKey] = useState(0);

  const handleNewScan = () => {
    setTab("domain");
    setActiveQuery(null);
    setRefreshKey(prev => prev + 1); // Forces component re-mount/reset
  };

  return (
    <div className="app">
      <MatrixBackground />
      <div className={`app-container ${!showSidebar ? "sidebar-collapsed" : ""}`}>
        <aside className="app-sidebar">
          <HistoryPanel 
            history={history} 
            onClear={handleClearHistory} 
            onItemClick={handleHistoryClick} 
            onDeleteItem={handleDeleteHistoryItem}
            onToggleSidebar={() => setShowSidebar(false)}
            onNewScan={handleNewScan}
          />
        </aside>

        {!showSidebar && (
          <button 
            className="sidebar-recover-btn"
            onClick={() => setShowSidebar(true)}
            title="Show Sidebar"
          >
            <PanelLeft size={24} />
          </button>
        )}

        <div className="main-content-wrapper">
          <Navbar />
          <section className="hero">
            <div className="hero-badge">
              <Shield size={16} /> SYSTEM: ONLINE
            </div>
            <h1 className="hero-title">
              Threat Intelligence
              <br />
              <span className="hero-title-highlight">Terminal</span>
            </h1>
            <p className="hero-desc">
              CyberDude multi-vector analysis terminal. Access real-time threat databases,
              extract heuristic payloads, and identify spoofed identities.
            </p>
          </section>

          <main className="workspace-main">
            <div className="workspace">
              <div className="tabs-header" style={{ flexWrap: "wrap" }}>
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    className={`tab-btn ${tab === id ? "tab-btn--active" : ""}`}
                    onClick={() => setTab(id)}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>

              <div className="workspace-content">
                {tab === "email" && <EmailCheckerPage key={`email-${refreshKey}`} onScan={(input, status) => handleScan("Email", input, status)} initialQuery={activeQuery} clearQuery={() => setActiveQuery(null)} />}
                {tab === "domain" && <DomainCheckerPage key={`domain-${refreshKey}`} onScan={(input, status) => handleScan("Domain", input, status)} initialQuery={activeQuery} clearQuery={() => setActiveQuery(null)} />}
              </div>
            </div>
          </main>
        </div>
      </div>

      <footer className="footer">
        <p>CyberDude &copy; {new Date().getFullYear()} — Built for cybersecurity awareness.</p>
      </footer>
    </div>
  );
}

export default App;
