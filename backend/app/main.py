from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models import SignUpRequest, LoginRequest, AuthResponse
from .supabase_auth import signup, login

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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)