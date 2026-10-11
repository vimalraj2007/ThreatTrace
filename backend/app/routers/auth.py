from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.models.schemas import LoginRequest, TokenResponse
from app.core.security import create_access_token
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username == settings.DEMO_ANALYST_EMAIL and form_data.password == settings.DEMO_ANALYST_PASSWORD:
        access_token = create_access_token(data={"sub": form_data.username})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "email": form_data.username,
                "role": "analyst",
                "name": "Sarah Connor"
            }
        }
    
    # Also support fallback for quick demo login
    if form_data.username and form_data.password:
        access_token = create_access_token(data={"sub": form_data.username})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "email": form_data.username,
                "role": "analyst",
                "name": "SOC Analyst"
            }
        }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect analyst email or password",
        headers={"WWW-Authenticate": "Bearer"},
    )
