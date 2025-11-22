import os
from uuid import UUID
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, Depends, Request, HTTPException, status
from dotenv import load_dotenv
import uvicorn
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

# Import local modules
from src.config.db import get_db
from src.auth.auth_guard import auth_guard
from migration_module.models import Auction, RealEstate, UserRole

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Auction Service",
    version="1.0.0",
    description="Auction management service"
)

# --- Health Check ---
@app.get("/auction/health")
async def health_check():
    return {"status": "healthy", "service": "auction"}


# --- Pydantic Schemas ---
class CreateAuctionRequest(BaseModel):
    real_estate_id: UUID
    start_date: datetime
    end_date: datetime
    min_step: float = Field(..., gt=0)
    min_price: float = Field(..., gt=0)
    description: Optional[str] = None

class UpdateAuctionRequest(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    min_step: Optional[float] = Field(None, gt=0)
    min_price: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None

@app.post("/auction/create", status_code=status.HTTP_201_CREATED)
async def create_auction(
        request: Request,
        payload: CreateAuctionRequest,
        user: dict = Depends(auth_guard),
        db: Session = Depends(get_db)
):
    """
    Create a new auction.
    Guard: Only 'realtor' (Property Owner role proxy) can create.
    """
    user_role = user.get("role")
    if user_role != UserRole.realtor.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only property owners (realtors) can create auctions."
        )

    real_estate = db.query(RealEstate).filter(RealEstate.id == payload.real_estate_id).first()
    if not real_estate:
        raise HTTPException(status_code=404, detail="Real Estate property not found.")

    # 3. Create Auction
    new_auction = Auction(
        real_estate_id=payload.real_estate_id,
        start_date=payload.start_date,
        end_date=payload.end_date,
        min_step=payload.min_step,
        min_price=payload.min_price,
        description=payload.description
    )

    db.add(new_auction)
    db.commit()
    db.refresh(new_auction)

    response = {
        "message": "Auction created successfully",
        "auction": new_auction
    }

    if hasattr(request.state, "new_access_token"):
        response["newAccessToken"] = request.state.new_access_token

    return response


@app.patch("/auction/{auction_id}")
async def update_auction(
        auction_id: UUID,
        payload: UpdateAuctionRequest,
        request: Request,
        user: dict = Depends(auth_guard),
        db: Session = Depends(get_db)
):
    """
    Update an auction.
    Guard: User must be authenticated.
    Logic: Abort if start_date >= now (per instructions).
    """
    # 1. Get Auction
    auction = db.query(Auction).filter(Auction.id == auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")

    # 2. Logic Check: if start date >= now -> abort changes
    # Note: using UTC for comparison
    now = datetime.now(auction.start_date.tzinfo or None)

    # If the auction start date is in the future (or now), we abort.
    if auction.start_date >= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update auction: Start date is in the future or is happening now."
        )

    # 3. Apply Updates
    if payload.start_date:
        auction.start_date = payload.start_date
    if payload.end_date:
        auction.end_date = payload.end_date
    if payload.min_step:
        auction.min_step = payload.min_step
    if payload.min_price:
        auction.min_price = payload.min_price
    if payload.description is not None:
        auction.description = payload.description

    auction.updated_at = datetime.now()
    db.commit()
    db.refresh(auction)

    response = {
        "message": "Auction updated successfully",
        "auction": auction
    }

    if hasattr(request.state, "new_access_token"):
        response["newAccessToken"] = request.state.new_access_token

    return response


@app.delete("/auction/{auction_id}")
async def delete_auction(
        auction_id: UUID,
        request: Request,
        user: dict = Depends(auth_guard),
        db: Session = Depends(get_db)
):
    """
    Soft delete an auction.
    Guard: User must be authenticated.
    Logic: Abort if start_date >= now (per instructions 'new').
    """
    # 1. Get Auction
    auction = db.query(Auction).filter(Auction.id == auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")

    # 2. Logic Check: if start date >= now -> abort
    now = datetime.now(auction.start_date.tzinfo or None)

    if auction.start_date >= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete auction: Start date is in the future or is happening now."
        )

    # 3. Soft Delete
    auction.deleted_at = datetime.now()
    db.commit()

    response = {
        "message": "Auction deleted successfully"
    }

    if hasattr(request.state, "new_access_token"):
        response["newAccessToken"] = request.state.new_access_token

    return response


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 80)),
        reload=True
    )