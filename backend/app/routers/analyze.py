from fastapi import APIRouter
from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.analysis import run_analysis_pipeline

router = APIRouter(tags=["analyze"])

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    result = run_analysis_pipeline()
    return result
