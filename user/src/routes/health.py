from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from user.src.config.db import get_db, engine

router = APIRouter()

@router.get("/user/health")
async def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint
    Checks if the service is running and database is accessible
    """
    try:
        # Check database connection
        db.execute("SELECT 1")

        return {
            "status": "healthy",
            "service": "user",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "user",
            "database": "disconnected",
            "error": str(e)
        }