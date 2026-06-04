import httpx
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import SignUpRequest, LoginRequest, AuthResponse, WardrobeItemCreate, WardrobeItemResponse, CalendarEventCreate, CalendarEventResponse
from .supabase_auth import signup, login, get_user_id
from .config import SUPABASE_URL, SUPABASE_ANON_KEY

app = FastAPI(title="StyleSync API", version="0.1.0")

# CORS — allow the React dev server and Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://stylesync-jhvtrumj9-ahmad-dalvi-s-projects.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.post("/auth/signup", response_model=AuthResponse)
async def auth_signup(body: SignUpRequest):
    result = await signup(
        email=body.email,
        password=body.password,
        full_name=body.full_name,
    )
    return result


@app.post("/auth/login", response_model=AuthResponse)
async def auth_login(body: LoginRequest):
    result = await login(
        email=body.email,
        password=body.password,
    )
    return result


REST_BASE = f"{SUPABASE_URL}/rest/v1"
REST_HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}


@app.post("/wardrobe", response_model=list[WardrobeItemResponse])
async def add_wardrobe_item(
    body: WardrobeItemCreate,
    authorization: str = Header(...),
):
    """Save a wardrobe item for the authenticated user."""
    token = authorization.replace("Bearer ", "")
    user_id = await get_user_id(token)

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{REST_BASE}/wardrobe_items",
            headers={
                **REST_HEADERS,
                "Authorization": f"Bearer {token}",
            },
            json={
                "user_id": user_id,
                "name": body.name,
                "category": body.category,
                "style": body.style,
                "emoji": body.emoji,
            },
        )

    if response.status_code not in (200, 201):
        raise HTTPException(
            status_code=response.status_code,
            detail=response.text,
        )

    return response.json()


@app.get("/wardrobe", response_model=list[WardrobeItemResponse])
async def get_wardrobe_items(authorization: str = Header(...)):
    """Retrieve all wardrobe items for the authenticated user."""
    token = authorization.replace("Bearer ", "")
    user_id = await get_user_id(token)

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{REST_BASE}/wardrobe_items",
            headers={
                **REST_HEADERS,
                "Authorization": f"Bearer {token}",
            },
            params={
                "user_id": f"eq.{user_id}",
                "order": "id.asc",
            },
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=response.text,
        )

    return response.json()


@app.post("/calendar", response_model=list[CalendarEventResponse])
async def add_calendar_event(
    body: CalendarEventCreate,
    authorization: str = Header(...),
):
    """Save a calendar event for the authenticated user."""
    token = authorization.replace("Bearer ", "")
    user_id = await get_user_id(token)

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{REST_BASE}/calendar_events",
            headers={
                **REST_HEADERS,
                "Authorization": f"Bearer {token}",
            },
            json={
                "user_id": user_id,
                "day": body.day,
                "event_name": body.event_name,
                "occasion": body.occasion,
            },
        )

    if response.status_code not in (200, 201):
        raise HTTPException(
            status_code=response.status_code,
            detail=response.text,
        )

    return response.json()


@app.get("/calendar", response_model=list[CalendarEventResponse])
async def get_calendar_events(authorization: str = Header(...)):
    """Retrieve all calendar events for the authenticated user."""
    token = authorization.replace("Bearer ", "")
    user_id = await get_user_id(token)

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{REST_BASE}/calendar_events",
            headers={
                **REST_HEADERS,
                "Authorization": f"Bearer {token}",
            },
            params={
                "user_id": f"eq.{user_id}",
                "order": "id.asc",
            },
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=response.text,
        )

    return response.json()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)