from pydantic import BaseModel, field_validator
from typing import Any, Optional


class APIResponse(BaseModel):
    status: str
    message: str
    data: Optional[Any] = None


class EmailCheckRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not v:
            raise ValueError("Email content cannot be empty")
        return v


class EmailCheckResult(BaseModel):
    status: str          # "warning" | "safe"
    message: str
    matched_keywords: list[str]


class DomainCheckRequest(BaseModel):
    website: str

    @field_validator("website")
    @classmethod
    def validate_website(cls, v: str) -> str:
        v = v.strip().lower()
        if not v:
            raise ValueError("Website cannot be empty")
        return v


class DomainCheckResult(BaseModel):
    status: str                      # "safe" | "suspicious" | "unknown"
    confidence_score: float
    matched_domain: Optional[str] = None


class HeaderCheckRequest(BaseModel):
    headers: str
    
class HeaderCheckResult(BaseModel):
    status: str
    spf: str
    dkim: str
    dmarc: str
    notes: list[str]

class BreachCheckRequest(BaseModel):
    email: str

class BreachCheckResult(BaseModel):
    status: str
    breach_count: int
    breaches: list[dict]

class FileAnalyzeRequest(BaseModel):
    filename: str

class FileAnalyzeResult(BaseModel):
    status: str
    risk_score: float
    message: str

class ReportThreatRequest(BaseModel):
    threat_type: str
    indicator: str
