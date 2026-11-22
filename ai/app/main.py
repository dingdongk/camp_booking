from fastapi import FastAPI

app = FastAPI(title="VietCamp AI service")


@app.get("/health")
def health() -> dict:
    return {"ok": True}