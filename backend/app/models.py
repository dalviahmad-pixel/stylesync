from pydantic import BaseModel, EmailStr
from typing import Optional, Any


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: dict[str, Any]


class WardrobeItemCreate(BaseModel):
    name: str
    category: str
    style: str
    emoji: str


class WardrobeItemResponse(BaseModel):
    id: int | str
    user_id: str
    name: str
    category: str
    style: str
    emoji: str


class CalendarEventCreate(BaseModel):
    day: str
    event_name: str
    occasion: str


class CalendarEventResponse(BaseModel):
    id: int | str
    user_id: str
    day: str
    event_name: str
    occasion: str
