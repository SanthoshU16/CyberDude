from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.models.schemas import BreachCheckRequest, APIResponse, BreachCheckResult
from app.utils.logger import get_logger
import hashlib

logger = get_logger(__name__)
limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api/v1/breach", tags=["Breach Checker"])

# Dummy breached databases
KNOWN_BREACHES = [
    {"name": "Canva", "date": "2019-05-24", "details": "Emails, Passwords, Names"},
    {"name": "LinkedIn", "date": "2012-05-05", "details": "Emails, Passwords"},
    {"name": "Adobe", "date": "2013-10-04", "details": "Emails, Passwords, Hints"},
    {"name": "Dropbox", "date": "2012-07-01", "details": "Emails, Passwords"}
]

@router.post("/check", response_model=APIResponse)
@limiter.limit("10/minute")
async def check_breach(request: Request, body: BreachCheckRequest):
    logger.info(f"Checking breach for {body.email}")
    email = body.email.strip().lower()
    
    # Deterministic mock response based on email hash
    hash_val = int(hashlib.md5(email.encode()).hexdigest(), 16)
    
    breaches_found = []
    # ~30% chance to be in a breach, using modulus hash
    if hash_val % 100 < 30:
        num_breaches = (hash_val % 3) + 1
        breaches_found = [KNOWN_BREACHES[(hash_val + i) % len(KNOWN_BREACHES)] for i in range(num_breaches)]
        
    status = "warning" if len(breaches_found) > 0 else "safe"
    
    result = BreachCheckResult(
        status=status,
        breach_count=len(breaches_found),
        breaches=breaches_found
    )
    
    return APIResponse(status="success", message="Breach check complete.", data=result.model_dump())
