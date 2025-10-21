import os
import jwt
import httpx
from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional

security = HTTPBearer()

class AuthGuard:
    def __init__(self):
        self.public_key_path = os.getenv("PUBLIC_KEY_PATH")
        self.public_key = self._load_public_key()
        self.refresh_url = "http://nginx/auth/refresh"

    def _load_public_key(self) -> str:
        """Load the public key from file"""
        try:
            with open(self.public_key_path, "r") as f:
                return f.read()
        except FileNotFoundError:
            raise RuntimeError(
                f"Public key not found at {self.public_key_path}"
            )

    def _verify_token(self, token: str) -> dict:
        """Verify JWT token using public key"""
        try:
            payload = jwt.decode(
                token,
                self.public_key,
                algorithms=["RS256"]
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

    async def _refresh_token(
            self,
            refresh_token: Optional[str]
    ) -> Optional[str]:
        """Request new access token using refresh token"""
        if not refresh_token:
            return None

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.refresh_url,
                    cookies={"refreshToken": refresh_token},
                    timeout=5.0
                )

                if response.status_code == 200:
                    data = response.json()
                    return data.get("accessToken")
                return None
        except Exception as e:
            print(f"Error refreshing token: {e}")
            return None

    async def __call__(
            self,
            request: Request,
            credentials: HTTPAuthorizationCredentials = security
    ):
        """
        Verify the access token. If expired, try to refresh it.
        """
        token = credentials.credentials

        try:
            # Try to verify the current token
            payload = self._verify_token(token)
            request.state.user = payload
            return payload
        except HTTPException as e:
            # If token is expired, try to refresh
            if e.status_code == status.HTTP_401_UNAUTHORIZED:
                refresh_token = request.cookies.get("refreshToken")

                if refresh_token:
                    new_access_token = await self._refresh_token(
                        refresh_token
                    )

                    if new_access_token:
                        # Verify the new token
                        payload = self._verify_token(new_access_token)
                        request.state.user = payload
                        request.state.new_access_token = new_access_token
                        return payload

            # If refresh failed or no refresh token, raise the exception
            raise e


auth_guard = AuthGuard()