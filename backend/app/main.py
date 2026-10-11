from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.routers import (
    auth,
    health,
    ingest,
    analyze,
    dashboard,
    incidents,
    events,
    hosts,
    investigations,
    reports
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url="/openapi.json"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom exception handler to hide stack traces from client responses
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again or narrow your query parameters."}
    )

# Include API Routers under /api/v1
api_v1_prefix = settings.API_V1_STR

app.include_router(health.router, prefix=api_v1_prefix)
app.include_router(auth.router, prefix=api_v1_prefix)
app.include_router(ingest.router, prefix=api_v1_prefix)
app.include_router(analyze.router, prefix=api_v1_prefix)
app.include_router(dashboard.router, prefix=api_v1_prefix)
app.include_router(incidents.router, prefix=api_v1_prefix)
app.include_router(events.router, prefix=api_v1_prefix)
app.include_router(hosts.router, prefix=api_v1_prefix)
app.include_router(investigations.router, prefix=api_v1_prefix)
app.include_router(reports.router, prefix=api_v1_prefix)

@app.get("/")
def root():
    return {"message": "ThreatTrace API is running", "docs": "/docs"}
