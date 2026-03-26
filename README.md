# 🛡️ Cyber Dude: Tech Stack & Implementation Details

A high-performance cybersecurity suite with a focus on phishing detection and data breach analysis.

---

## 🛠️ Tech Stack

### Frontend Architecture
- **Framework:** [React 19+](https://react.dev/) (via [Vite](https://vitejs.dev/))
- **Icons:** [Lucide-React](https://lucide.dev/)
- **State Management:** React Hooks (`useState`, `useEffect`, `useContext`)
- **API Client:** [Axios](https://axios-http.com/) (with custom service wrappers)
- **Styling:** Vanilla CSS 3 (Design Tokens, Flexbox/Grid, Glassmorphism)
- **Persistence:** Browser `localStorage` (Session/Scan History)

### Backend Architecture
- **Language:** [Python 3.10+](https://www.python.org/)
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **API Server:** [Uvicorn](https://www.uvicorn.org/) (Asynchronous Server Gateway)
- **Rate Limiting:** [SlowAPI](https://github.com/lauryndas/slowapi) (DDoS protection)
- **Security:** [Pydantic v2](https://docs.pydantic.dev/) (Data validation/schemas)
- **Environment:** [Python-Dotenv](https://pypi.org/project/python-dotenv/)

### Infrastructure & Deployment
- **Frontend Hosting:** [Vercel](https://vercel.com/) (Production build)
- **Backend Hosting:** [Render](https://render.com/) (Python Web Service)
- **CI/CD:** [GitHub](https://github.com/) (Automated deployments)

---

## 🔍 Core Security Logic
- **Phishing Detection:** Custom regex and keyword-based heuristics for deceptive link analysis.
- **Breach Integration:** Static/Dynamic lookup logic for known email compromises.
- **Domain IQ:** ASN lookup simulations and reputation-based scoring models.
- **Header Analysis:** Deep SMTP header parsing (SPF/DKIM/DMARC status simulation).

---

## 📦 Project Metadata
- **Backend Entry:** `backend/main.py`
- **Frontend Entry:** `frontend/src/main.jsx`
- **Environment Management:** Multi-tier `.env` configuration (Frontend/Backend isolated).
