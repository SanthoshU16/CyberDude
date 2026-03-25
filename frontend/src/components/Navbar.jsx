import React from "react";
import "./Navbar.css";
import { ShieldCheck } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <ShieldCheck size={28} className="navbar-icon" />
          <span className="navbar-title">CyberDude</span>
          <span className="navbar-badge">AI</span>
        </div>
        <div className="navbar-tagline">Detect phishing. Stay protected.</div>
      </div>
    </nav>
  );
};

export default Navbar;
