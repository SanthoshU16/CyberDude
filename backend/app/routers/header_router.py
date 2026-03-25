import re
from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.models.schemas import HeaderCheckRequest, APIResponse, HeaderCheckResult
from app.utils.logger import get_logger

logger = get_logger(__name__)
limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api/v1/headers", tags=["Header Analyzer"])

@router.post("/check", response_model=APIResponse)
@limiter.limit("20/minute")
async def check_headers(request: Request, body: HeaderCheckRequest):
    logger.info("Analyzing email headers")
    headers = body.headers.lower()
    
    spf = "None"
    dkim = "None"
    dmarc = "None"
    notes = []
    
    if "spf=pass" in headers: spf = "Pass"
    elif "spf=fail" in headers or "spf=softfail" in headers: spf = "Fail"
    
    if "dkim=pass" in headers: dkim = "Pass"
    elif "dkim=fail" in headers: dkim = "Fail"
    
    if "dmarc=pass" in headers: dmarc = "Pass"
    elif "dmarc=fail" in headers: dmarc = "Fail"
        
    status = "suspicious"
    if spf == "Pass" and dkim == "Pass" and dmarc == "Pass":
        status = "safe"
    elif spf == "Fail" or dkim == "Fail" or dmarc == "Fail":
        status = "warning"
        notes.append("Critical authentication failure detected (Spoofing risk).")
        
    if spf == "None" and dkim == "None":
        notes.append("No authentication records found. Highly suspicious for external mail.")
        
    result = HeaderCheckResult(status=status, spf=spf, dkim=dkim, dmarc=dmarc, notes=notes)
    
    return APIResponse(status="success", message="Headers analyzed.", data=result.model_dump())
