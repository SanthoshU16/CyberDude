import os
from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.models.schemas import FileAnalyzeRequest, APIResponse, FileAnalyzeResult
from app.utils.logger import get_logger

logger = get_logger(__name__)
limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api/v1/file", tags=["File Analyzer"])

DANGEROUS_EXTS = {".exe", ".vbs", ".scr", ".bat", ".cmd", ".msi", ".jar", ".js"}
SUSPICIOUS_EXTS = {".zip", ".rar", ".7z", ".pdf", ".docm", ".xlsm"}

@router.post("/analyze", response_model=APIResponse)
@limiter.limit("20/minute")
async def analyze_file(request: Request, body: FileAnalyzeRequest):
    logger.info(f"Analyzing file attachment: {body.filename}")
    filename = body.filename.lower()
    _, ext = os.path.splitext(filename)
    
    if ext in DANGEROUS_EXTS:
        status = "warning"
        score = 95.0
        msg = f"CRITICAL: Executable or script extensions ({ext}) are highly dangerous in emails."
    elif ext in SUSPICIOUS_EXTS:
        status = "suspicious"
        score = 65.0
        msg = f"WARNING: Archive or macro-enabled documents ({ext}) often contain malware payloads."
    else:
        status = "safe"
        score = 5.0
        msg = f"Extension ({ext}) is generally safe, but always verify the sender."
        
    result = FileAnalyzeResult(status=status, risk_score=score, message=msg)
    
    return APIResponse(status="success", message="File analyzed.", data=result.model_dump())
