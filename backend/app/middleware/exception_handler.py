import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("exception_handler")


class ExceptionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except ValueError as exc:
            logger.warning(f"Validation error: {exc}")
            return JSONResponse(
                status_code=422,
                content={"status": "error", "message": str(exc), "data": None},
            )
        except Exception as exc:
            logger.error(f"Unhandled exception: {exc}", exc_info=True)
            return JSONResponse(
                status_code=500,
                content={
                    "status": "error",
                    "message": "Internal server error. Please try again later.",
                    "data": None,
                },
            )
