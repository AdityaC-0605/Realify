# Realify

Realify is a fake-news detection app with:
- FastAPI backend (`/app/backend/server.py`)
- React + Vite frontend (`/app/frontend`)
- Multiple ML models (LR, DT, RF, GB) with ensemble prediction

## Tech Stack
- Python (FastAPI, scikit-learn)
- React + Vite
- SerpAPI (for live Google News headlines)

## Project Structure
- `/app/backend/server.py` - FastAPI server
- `/app/backend/realtime_fake_new.py` - live news fetch + enhanced prediction
- `/app/frontend` - frontend application
- `/lr_model.pkl`, `/dt_model.pkl`, `/rf_model.pkl`, `/gb_model.pkl`, `/vectorizer.pkl` - trained artifacts

## Prerequisites
- Python 3.9+
- Node.js 18+
- npm 9+
- SerpAPI key (optional for live headlines, required for real news fetch)

## Environment Setup
Create root backend env file `/Users/aditya/Documents/Realify/.env`:

```bash
SERPAPI_KEY=your_serpapi_key_here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

Create frontend env file `/Users/aditya/Documents/Realify/app/frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:8001
```

## Run Backend
From project root:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
set -a
source .env
set +a
uvicorn server:app --app-dir app/backend --host 0.0.0.0 --port 8001 --reload
```

Backend health check:

```bash
curl http://localhost:8001/health
```

## Run Frontend
In a new terminal:

```bash
cd app/frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

Open: `http://localhost:3000`

## API Endpoints
- `GET /health` - service and model readiness
- `POST /api/analyze` - analyze manual news items
- `POST /api/live-news` - fetch and analyze live headlines
- `GET /api/dashboard` - dashboard analytics
- `GET /api/models` - model metadata

## Quick Demo Flow (For Presentation)
1. Open homepage and show navigation.
2. Go to **Manual Check** and analyze:
   - A realistic headline
   - An exaggerated/clickbait headline
3. Go to **Live News** and run a keyword query.
4. Open **Dashboard** and explain:
   - Model accuracies
   - Fake vs real prediction distribution
   - Recent prediction trend

## Troubleshooting
- `vite: command not found`:
  - Run `npm install` inside `/app/frontend`.
- `eslint: command not found`:
  - Run `npm install` inside `/app/frontend`.
- `ModuleNotFoundError: No module named 'numpy'`:
  - Activate virtualenv and run `pip install -r requirements.txt`.
- `ModuleNotFoundError: No module named 'app.backend'; 'app' is not a package`:
  - Run backend with `uvicorn server:app --app-dir app/backend ...` (not `uvicorn app.backend.server:app ...`).
- Live news returns fallback/sample data:
  - Ensure `SERPAPI_KEY` is set and valid.

## Notes
- If `SERPAPI_KEY` is not set, live-news fetch may return empty/fallback results.
- Model files are expected at project root.
