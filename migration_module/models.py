from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.dialects.postgresql import UUID
import sqlalchemy as sa
import enum

Base = declarative_base()
metadata = Base.metadata


class UserRole(enum.Enum):
    admin = "admin"
    client = "client"
    realtor = "realtor"

class User(Base):
    __tablename__ = "users"
    id = sa.Column(UUID(as_uuid=True), primary_key=True,
                   server_default=sa.text("gen_random_uuid()"))
    email = sa.Column(sa.String(255), nullable=False, unique=True)
    password = sa.Column(sa.String(255), nullable=False)

    data = relationship("UserData", back_populates="user", uselist=False,
                        cascade="all, delete-orphan")

    role = sa.Column(
        sa.Enum(UserRole, name="user_role_enum"),
        nullable=False,
        server_default="client"
    )

class UserData(Base):
    __tablename__ = "user_data"
    id = sa.Column(UUID(as_uuid=True), primary_key=True,
                   server_default=sa.text("gen_random_uuid()"))
    user_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"),
                        nullable=False)
    name = sa.Column(sa.String(40))
    birth_date = sa.Column(sa.Date())
    phone = sa.Column(sa.String(30))

    user = relationship("User", back_populates="data")

class RealEstate(Base):
    __tablename__ = "real_estate"

    id = sa.Column(UUID(as_uuid=True), primary_key=True,
                   server_default=sa.text("gen_random_uuid()"))
    name = sa.Column(sa.String(255), nullable=False)
    address = sa.Column(sa.String(255), nullable=True)
    cost = sa.Column(sa.Numeric(precision=12, scale=2), nullable=False)
    area = sa.Column(sa.Numeric(precision=10, scale=2), nullable=True)
    description = sa.Column(sa.Text, nullable=True)

    created_at = sa.Column(sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False)
    updated_at = sa.Column(sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False)
    deleted_at = sa.Column(sa.TIMESTAMP(timezone=True), nullable=True)

    auctions = relationship("Auction", back_populates="real_estate", cascade="all, delete-orphan")


class Auction(Base):
    __tablename__ = "auction"

    id = sa.Column(UUID(as_uuid=True), primary_key=True,
                   server_default=sa.text("gen_random_uuid()"))
    real_estate_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("real_estate.id", ondelete="CASCADE"), nullable=False)

    start_date = sa.Column(sa.TIMESTAMP(timezone=True), nullable=False)
    end_date = sa.Column(sa.TIMESTAMP(timezone=True), nullable=False)
    min_step = sa.Column(sa.Numeric(precision=12, scale=2), nullable=False)
    min_price = sa.Column(sa.Numeric(precision=12, scale=2), nullable=False)
    description = sa.Column(sa.Text, nullable=True)

    created_at = sa.Column(sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False)
    updated_at = sa.Column(sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False)
    deleted_at = sa.Column(sa.TIMESTAMP(timezone=True), nullable=True)

    real_estate = relationship("RealEstate", back_populates="auctions")