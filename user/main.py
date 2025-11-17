import os
from fastapi import FastAPI, Depends, Request
from dotenv import load_dotenv
import uvicorn
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
async def get_profile(user_data: dict = Depends(auth_guard)):
    """
    Protected endpoint - requires valid JWT token
    """
    return {
        "message": "Profile data",
        "user": user_data
    }


@app.get("/user/data")
async def get_user_data(
        request: Request,
        user_data: dict = Depends(auth_guard)
):
    """
    Protected endpoint with token refresh support
    """
    response_data = {
        "message": "User data",
        "user": user_data
    }

    # If a new access token was issued, include it in the response
    if hasattr(request.state, "new_access_token"):
        response_data["newAccessToken"] = request.state.new_access_token

    return response_data


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=os.getenv("PORT", 80),
        reload=True
    )