import os

class Settings:
    PROJECT_NAME: str = "ThreatTrace API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: list[str] = [
        os.getenv("CORS_ORIGINS", "http://localhost:3000"),
        "http://127.0.0.1:3000",
        "http://localhost:3000"
    ]
    JWT_SECRET: str = os.getenv("JWT_SECRET", "threattrace_super_secret_jwt_key_2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    DEMO_ANALYST_EMAIL: str = os.getenv("DEMO_ANALYST_EMAIL", "analyst.connor@threattrace.soc")
    DEMO_ANALYST_PASSWORD: str = os.getenv("DEMO_ANALYST_PASSWORD", "password123")

settings = Settings()
