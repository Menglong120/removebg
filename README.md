# Remove BG System

This repository is now split into two separate projects so the frontend and backend can be hosted independently.

## Structure

- `frontend/` — Next.js web UI
- `backend/` — Python Flask background-removal API

## Setup

### Backend

1. Change into the backend folder:

```powershell
cd backend
```

2. Create and activate a Python virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\Activate
```

3. Install Python dependencies:

```powershell
pip install -r requirements.txt
```

4. Start the backend API:

```powershell
python app.py
```

The backend listens on `http://localhost:5000` by default.

### Frontend

1. Change into the frontend folder:

```powershell
cd frontend
```

2. Install Node dependencies:

```powershell
npm install
```

3. Start the Next.js app:

```powershell
npm run dev
```

4. Open the UI at `http://127.0.0.1:3000`.

### Optional backend URL override

If the backend is hosted somewhere else, configure `NEXT_PUBLIC_BACKEND_URL` in `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.example.com
```

## How it works

- The frontend uploads an image directly to the backend API at `/remove`
- The backend uses `rembg` to remove the background
- A transparent PNG is returned to the browser for download

## Project layout

- `backend/app.py` — Flask API service
- `backend/remove_bg.py` — command-line helper for background removal
- `backend/requirements.txt` — Python dependencies
- `frontend/package.json` — Next.js dependencies and scripts
- `frontend/app/` — Next.js app routes and page components
- `frontend/components/` — shared UI components
- `frontend/lib/` — utility helpers
