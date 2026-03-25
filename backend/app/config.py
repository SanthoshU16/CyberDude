from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    app_name: str = "CyberDude API"
    app_version: str = "1.0.0"
    debug: bool = True
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"
    rate_limit_requests: int = 20
    rate_limit_window: int = 60

    @property
    def origins_list(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    class Config:
        env_file = ".env"


settings = Settings()
