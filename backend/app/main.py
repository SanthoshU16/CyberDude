from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.routers import email_router, domain_router, header_router, breach_router, file_router, report_router
from app.middleware.exception_handler import ExceptionMiddleware
from app.utils.logger import get_logger

logger = get_logger("main")

# ── Rate limiter ──────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Production-grade phishing detection API",
    docs_url="/docs",
    redoc_url="/redoc",
)

# State object required by slowapi
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── Middleware ────────────────────────────────────────────────────────────────
app.add_middleware(ExceptionMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(email_router.router)
app.include_router(domain_router.router)
app.include_router(header_router.router)
app.include_router(breach_router.router)
app.include_router(file_router.router)
app.include_router(report_router.router)


@app.get("/", tags=["Health"])
async def root():
    logger.info("Health check called")
    return {"status": "ok", "service": settings.app_name, "version": settings.app_version}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
