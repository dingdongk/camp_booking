# ai

Stateless Python AI service (Google ADK + Gemini on Vertex AI), deployed to Cloud Run.

```powershell
uv sync
uv run uvicorn app.main:app --reload --port 8080   # http://localhost:8080/health
uv run pytest
```

Deploy: `gcloud run deploy vietcamp-ai --source . --region asia-southeast1` (service account with the Vertex AI User role).