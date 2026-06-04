import httpx
from fastapi import HTTPException

from .config import SUPABASE_URL, SUPABASE_ANON_KEY

AUTH_BASE = f"{SUPABASE_URL}/auth/v1"
HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
}


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