# 🛡️ Cyber Dude: Tech Stack & Implementation Details

A streamlined cybersecurity suite specialized in domain phishing detection and email content analysis.

---

## 🛠️ Tech Stack

### Frontend Architecture
- **Framework:** [React 19+](https://react.dev/) (via [Vite](https://vitejs.dev/))
- **Icons:** [Lucide-React](https://lucide.dev/)
- **State Management:** React Hooks (`useState`, `useEffect`)
- **API Client:** [Axios](https://axios-http.com/)
- **Styling:** Vanilla CSS 3 (Design Tokens, Glassmorphism, Matrix Visuals)
- **Persistence:** Browser `localStorage` (Scan History)

### Backend Architecture
- **Language:** [Python 3.10+](https://www.python.org/)
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **API Server:** [Uvicorn](https://www.uvicorn.org/): High-performance ASGI server
- **Rate Limiting:** [SlowAPI](https://github.com/lauryndas/slowapi) for DDoS protection
- **Security:** [Pydantic v2](https://docs.pydantic.dev/) for data validation

### Infrastructure & Deployment
- **Frontend Hosting:** [Vercel](https://vercel.com/)
- **Backend Hosting:** [Render](https://render.com/)
- **CI/CD:** [GitHub](https://github.com/) actions

---

## 🔍 Core Security Logic

### 1. Domain Phishing Detection
Check domains or URLs for typosquatting and spoofing with similarity scoring.
- **Algorithm:** Character-level difference parsing and normalization.
- **Database:** Internal trusted whitelist for fuzzy matching.

### 2. Email Content Analysis
Heuristic scanning of email text for phishing indicators.
- **Indicators:** Urgency, financial keywords, credential requests, and suspicious URL patterns.
- **Scoring:** Multi-category scoring with distinct risk levels (Safe, Suspicious, Warning).

---

## 📦 Project Metadata
- **Backend Entry:** `backend/app/main.py`
- **Frontend Entry:** `frontend/src/main.jsx`
- **History Limit:** 15 most recent scans stored in `localStorage`.

---
## 👨‍💻Author  
---
Santhosh U
---
Student | AI & ML Enthusiast  

---
## 📫 Connect With Me

- 💼 LinkedIn: *https://www.linkedin.com/in/santhoshu1/*
- 📧 Email: *usanthosh0905@gmial.com*
- 🌐 GitHub: *https://github.com/SanthoshU16*
- 👨‍💻 Portfolio: *https://portfolio-murex-kappa-39.vercel.app*
