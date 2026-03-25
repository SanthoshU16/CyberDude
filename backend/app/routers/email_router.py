from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models.schemas import EmailCheckRequest, APIResponse
from app.services.email_service import email_service
from app.utils.logger import get_logger

logger = get_logger(__name__)
limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api/v1/email", tags=["Email Checker"])


@router.post("/check", response_model=APIResponse)
@limiter.limit("20/minute")
async def check_email(request: Request, body: EmailCheckRequest):
    logger.info("POST /api/v1/email/check called")
    result = email_service.check(body.email)
    return APIResponse(
        status="success",
        message="Email analysis complete.",
        data=result.model_dump(),
    )
