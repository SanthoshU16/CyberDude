from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models.schemas import DomainCheckRequest, APIResponse
from app.services.domain_service import domain_service
from app.utils.logger import get_logger

logger = get_logger(__name__)
limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api/v1/domain", tags=["Domain Checker"])


@router.post("/check", response_model=APIResponse)
@limiter.limit("20/minute")
async def check_domain(request: Request, body: DomainCheckRequest):
    logger.info("POST /api/v1/domain/check called")
    result = domain_service.check(body.website)
    return APIResponse(
        status="success",
        message="Domain analysis complete.",
        data=result.model_dump(),
    )
