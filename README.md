# 🛡️ Cyber Dude: Advanced Cybersecurity Suite

A professional, production-grade cybersecurity toolset for phishing detection, data breach analysis, and threat intelligence. Cyber Dude provides a monolithic-style dashboard with specialized scanners to keep users safe from modern digital threats.

---

## 🚀 Key Features

### 🔍 Specialized Scanners
- **Data Breach Scanner:** Instantly check if an email address has been compromised in known historical data leaks.
- **Phishing Email Analyzer:** Uses advanced logic to detect suspicious links, spoofed addresses, and social engineering patterns.
- **Domain Security Checker:** Evaluates domain reputation, age, and certificate status to identify "look-alike" or malicious domains.
- **Email Header Analyzer:** Deep-dives into email headers (SPF, DKIM, DMARC) to verify sender authenticity and detect spoofing.
- **Malware File Scanner:** Analyzes file signatures and checksums against known threat databases.
- **Threat Reporting:** A centralized portal for users to report newly discovered phishing campaigns or malicious entities.

### 🎨 Premium User Experience
- **Modern UI:** A stunning, desktop-app-like interface with glassmorphism effects and modern typography.
- **Matrix Background:** A dynamic, high-performance binary matrix effect for a professional "secure suite" aesthetic.
- **Responsive Navigation:** Fixed-position sidebar for seamless switching between different security modules.
- **Live Scan History:** Keep track of recent scans directly within the dashboard for quick reference.

---

## 🛠️ Technical Architecture

The project follows a **Monorepo** structure, optimized for hybrid cloud deployment.

### 💻 Frontend (Vercel)
- **Framework:** [React 19+](https://react.dev/) via [Vite](https://vitejs.dev/)
- **Icons:** [Lucide-React](https://lucide.dev/)
- **Styling:** Vanilla CSS 3 with custom Design Tokens (no heavy frameworks for maximum performance).
- **State Management:** React Hooks with local storage persistence for scan history.

### ⚙️ Backend (Render)
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **Rate Limiting:** [SlowAPI](https://github.com/lauryndas/slowapi) for DDoS protection and API fair use.
- **Server:** [Uvicorn](https://www.uvicorn.org/) for high-concurrency performance.
- **Security:** Built-in CORS middleware and production-grade Exception Handling.

---

## 📂 Project Structure

```text
Detailed Tree:
├── backend/                # FastAPI Application
│   ├── app/                # Core Logic
│   │   ├── routers/        # API Endpoints (Email, Domain, File, etc.)
│   │   ├── services/       # Business Logic & Third-party integrations
│   │   ├── models/         # Pydantic Schemas
│   │   └── utils/          # Middleware, Logging, and Helpers
│   ├── requirements.txt    # Python Dependencies
│   └── main.py             # Entry point
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI Blocks (Sidebar, ResultCards, etc.)
│   │   ├── pages/          # Individual Scanner Views
│   │   ├── services/       # Axios API integrations
│   │   └── assets/         # Styles and Design Tokens
│   ├── vercel.json         # Vercel Config
│   └── vite.config.js      # Vite Config
└── render.yaml             # Render Blueprint for Backend
```

---

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)

### Backend Setup
1. Navigate to `backend/`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Create a `.env` file from the local variables.
4. Run locally: `uvicorn app.main:app --reload`.

### Frontend Setup
1. Navigate to `frontend/`.
2. Install dependencies: `npm install`.
3. Set `VITE_API_BASE_URL` in your `.env`.
4. Run development server: `npm run dev`.

---

## 🌐 Deployment

- **Frontend:** Automatically deployed via Vercel GitHub integration (Root: `frontend/`).
- **Backend:** Hosted on Render as a Web Service (Root: `backend/`).

---

## 📜 License
*Proprietary - Developed for Santhosh's Cybersecurity Portfolio.*
