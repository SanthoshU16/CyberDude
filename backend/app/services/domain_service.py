from app.models.schemas import DomainCheckResult
from app.utils.phishing_utils import check_domain_similarity
from app.utils.logger import get_logger

logger = get_logger(__name__)


class DomainService:
    def check(self, website: str) -> DomainCheckResult:
        logger.info(f"Checking domain: {website}")
        status, confidence_score, matched_domain = check_domain_similarity(website)
        logger.info(
            f"Domain check result — status={status}, score={confidence_score}, match={matched_domain}"
        )
        return DomainCheckResult(
            status=status,
            confidence_score=confidence_score,
            matched_domain=matched_domain,
        )


domain_service = DomainService()
