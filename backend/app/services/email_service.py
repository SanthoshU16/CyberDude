from app.models.schemas import EmailCheckResult
from app.utils.phishing_utils import analyze_email_content
from app.utils.logger import get_logger

logger = get_logger(__name__)


class EmailService:
    def check(self, email_text: str) -> EmailCheckResult:
        logger.info("Checking email text for phishing indicators...")
        status, message, matched = analyze_email_content(email_text)
        
        logger.info(f"Email analysis result -> status={status}, matched={matched}")
        
        return EmailCheckResult(
            status=status,
            message=message,
            matched_keywords=matched,
        )


email_service = EmailService()
