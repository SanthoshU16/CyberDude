import sqlite3
from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.models.schemas import ReportThreatRequest, APIResponse
from app.utils.logger import get_logger

logger = get_logger(__name__)
limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api/v1/report", tags=["Report Threat"])

# Setup generic SQLite connection
DB_PATH = "threats.db"
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS reported_threats 
                      (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                       type TEXT, 
                       indicator TEXT, 
                       timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

init_db()

@router.post("/", response_model=APIResponse)
@limiter.limit("10/minute")
async def report_threat(request: Request, body: ReportThreatRequest):
    logger.info(f"Reporting new threat: {body.threat_type} -> {body.indicator}")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO reported_threats (type, indicator) VALUES (?, ?)", (body.threat_type, body.indicator))
    conn.commit()
    conn.close()
    
    return APIResponse(status="success", message=f"Successfully reported {body.threat_type} to community database.", data=None)
