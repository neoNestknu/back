import os
from uuid import UUID

from fastapi import FastAPI, Depends, Request, status, HTTPException
from dotenv import load_dotenv
import uvicorn
from sqlalchemy.orm import Session, joinedload

from migration_module.models import User, UserData
from user.src.config.db import get_db
from src.routes.health import health_router
from src.auth.auth_guard import auth_guard

# Load environment variables
load_dotenv()

app = FastAPI(
    title="User Service",
    version="1.0.0",
    description="User management service"
)

# Include routers
app.include_router(health_router, tags=["health"])

# Example of a protected endpoint
@app.get("/user/profile")
async def get_profile(request: Request, user: dict = Depends(auth_guard), db: Session = Depends(get_db)):
    """
        Endpoint returning user + potential new access token
    """
    user_id = user.get("id")

    user = db.query(User).filter(User.id == UUID(user_id)).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    response_payload = {
        "message": "User retrieved successfully",
        "user": user
    }

    if hasattr(request.state, "new_access_token"):
        response_payload["newAccessToken"] = request.state.new_access_token

    return response_payload


@app.get("/user/data")
async def get_user_data(
        request: Request,
        user_data: dict = Depends(auth_guard),
        db: Session = Depends(get_db)
):
    """
    Endpoint returning user data + potential new access token
    """
    user_data_id = user_data.get("id")

    user_data = db.query(UserData).filter(UserData.id == UUID(user_data_id)).first()

    if not user_data:
        raise HTTPException(status_code=404, detail="User data not found")

    response_payload = {
        "message": "User data retrieved successfully",
        "user_data": user_data
    }

    if hasattr(request.state, "new_access_token"):
        response_payload["newAccessToken"] = request.state.new_access_token

    return response_payload


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=os.getenv("PORT", 80),
        reload=True
    )