from pydantic import BaseModel


class ChatTurn(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    user_id: str
    session_id: str
    history: list[ChatTurn]
    message: str


class ChatResponse(BaseModel):
    reply: str
    filters: dict = {}
    campsite_ids: list[str] = []