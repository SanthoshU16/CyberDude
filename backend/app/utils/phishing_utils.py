import re
from typing import Optional

PHISHING_INDICATORS = {
    "urgency": ["urgent", "immediately", "action required", "act now", "suspended", "expire", "unauthorized", "attention", "warning", "overdue", "final notice", "within 24 hours"],
    "financial": ["bank", "payment", "invoice", "refund", "billing", "credit card", "transfer", "tax", "irs", "statement", "w-2", "wire", "deposit"],
    "credentials": ["verify", "password", "login", "confirm", "security", "authenticate", "account", "update your", "validate"],
    "general": ["click", "link", "attachment", "prize", "winner", "selected", "gift card", "claim"]
}

def analyze_email_content(email_text: str) -> tuple[str, str, list[str]]:
    """Returns (status, message, matched_keywords)"""
    email_text = email_text.lower()
    
    matched = set()
    score = 0
    
    for category, words in PHISHING_INDICATORS.items():
        for word in words:
            if word in email_text:
                matched.add(word)
                if category in ("urgency", "credentials"):
                    score += 2
                else:
                    score += 1

    # Look for hidden URLs
    if re.search(r'(http|https)://[^\s]+', email_text):
        matched.add("contains URL")
        # suspicious shorteners
        if re.search(r'(bit\.ly|tinyurl|is\.gd|goo\.gl|t\.co)', email_text):
            score += 3
            matched.add("URL shortener")
        else:
            score += 1

    matched_list = sorted(list(matched))
    
    if score >= 4:
        return ("warning", "HIGH RISK! Multiple critical phishing indicators combinations identified. Do not interact.", matched_list)
    elif score >= 2:
        return ("suspicious", "SUSPICIOUS. Exercise extreme caution before clicking links or downloading attachments.", matched_list)
    elif score == 1:
        return ("safe", "Minor generic keyword found, but overall risk appears low.", matched_list)
    else:
        return ("safe", "No obvious phishing indicators found. This email looks clean.", [])

TRUSTED_DOMAINS = [
    "google.com",
    "chatgpt.com",
    "facebook.com",
    "amazon.com",
    "microsoft.com",
    "apple.com",
    "github.com",
    "twitter.com",
    "instagram.com",
    "linkedin.com",
    "netflix.com",
    "paypal.com",
    "youtube.com",
]


def extract_base_domain(domain: str) -> str:
    domain = domain.lower().strip()
    # strip protocol and trailing slashes
    for prefix in ("https://", "http://", "www."):
        if domain.startswith(prefix):
            domain = domain[len(prefix):]
    domain = domain.split("/")[0]
    return domain


def normalize_domain(domain: str) -> str:
    """Replace common leet-speak characters used in typosquatting."""
    domain = extract_base_domain(domain)
    domain = domain.replace("0", "o").replace("1", "l")
    return domain


def char_diff_score(a: str, b: str) -> int:
    """Count character-level differences (positional mismatch + length diff)."""
    len_diff = abs(len(a) - len(b))
    min_len = min(len(a), len(b))
    positional = sum(1 for i in range(min_len) if a[i] != b[i])
    return positional + len_diff


def similarity_confidence(diff: int, domain_len: int) -> float:
    """Convert diff count to a 0-100 confidence score."""
    if domain_len == 0:
        return 0.0
    score = max(0.0, 1.0 - diff / domain_len) * 100
    return round(score, 1)


def check_domain_similarity(
    input_domain: str,
) -> tuple[str, float, Optional[str]]:
    """
    Returns (status, confidence_score, matched_domain).
    status: 'safe' | 'suspicious' | 'unknown'
    """
    base_input = extract_base_domain(input_domain)
    normalized_input = normalize_domain(input_domain)

    # Exact vs Normalized Check
    for trusted in TRUSTED_DOMAINS:
        base_trusted = extract_base_domain(trusted)
        
        if base_input == base_trusted:
            return ("safe", 100.0, trusted)
        elif normalized_input == normalize_domain(trusted):
            return ("suspicious", 99.0, trusted)

    # Near-match search (fuzzy)
    best_match: Optional[str] = None
    best_score: float = 0.0

    for trusted in TRUSTED_DOMAINS:
        normalized_trusted = normalize_domain(trusted)
        diff = char_diff_score(normalized_input, normalized_trusted)
        confidence = similarity_confidence(diff, len(normalized_trusted))
        if confidence > best_score:
            best_score = confidence
            best_match = trusted

    if best_score >= 70.0:
        return ("suspicious", best_score, best_match)

    return ("unknown", best_score, None)
