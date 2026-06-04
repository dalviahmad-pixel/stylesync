import logging
import httpx
from fastapi import HTTPException

from .config import SUPABASE_URL, SUPABASE_ANON_KEY

logger = logging.getLogger(__name__)

AUTH_BASE = f"{SUPABASE_URL}/auth/v1"
HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
}


async def get_user_id(access_token: str) -> str:
    """Get the authenticated user's ID from their access token."""
    url = f"{AUTH_BASE}/user"
    token_preview = access_token[:20] + "..." if len(access_token) > 20 else access_token
    logger.info(f"[get_user_id] Calling Supabase auth: {url}")
    logger.info(f"[get_user_id] Token preview: {token_preview}")

    async with httpx.AsyncClient() as client:
        response = await client.get(
            url,
            headers={
                **HEADERS,
                "Authorization": f"Bearer {access_token}",
            },
        )

    logger.info(f"[get_user_id] Supabase response status: {response.status_code}")
    logger.info(f"[get_user_id] Supabase response body: {response.text}")

    if response.status_code != 200:
        logger.error(
            f"[get_user_id] FAILED — Supabase returned {response.status_code}: {response.text}"
        )
        raise HTTPException(
            status_code=401,
            detail=f"Invalid or expired token. Supabase response: {response.text}",
        )

    data = response.json()
    user_id = data.get("id", "")
    logger.info(f"[get_user_id] Resolved user_id: {user_id}")
    return user_id


async def signup(email: str, password: str, full_name: str) -> dict:
    """Create a new user via Supabase Auth REST API."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{AUTH_BASE}/signup",
            headers=HEADERS,
            json={
                "email": email,
                "password": password,
                "data": {"full_name": full_name},
            },
        )

    data = response.json()

    if response.status_code != 200:
        msg = data.get("msg", data.get("message", "Signup failed"))
        raise HTTPException(status_code=response.status_code, detail=msg)

    # Supabase returns user + session on signup
    return {
        "access_token": data.get("access_token", ""),
        "refresh_token": data.get("refresh_token", ""),
        "user": data.get("user", {}),
    }


async def login(email: str, password: str) -> dict:
    """Authenticate a user via Supabase Auth REST API."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{AUTH_BASE}/token?grant_type=password",
            headers=HEADERS,
            json={
                "email": email,
                "password": password,
            },
        )

    data = response.json()

    if response.status_code != 200:
        msg = data.get("error_description", data.get("msg", "Login failed"))
        raise HTTPException(status_code=401, detail=msg)

    return {
        "access_token": data.get("access_token", ""),
        "refresh_token": data.get("refresh_token", ""),
        "user": data.get("user", {}),
    }