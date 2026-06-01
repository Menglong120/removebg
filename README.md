# Remove BG System

A modern background-removal app with a Next.js frontend and a Python backend bridge using `rembg`.

## Setup

### 1. Python backend

Create and activate a Python virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\Activate
```

Install Python dependencies:

```powershell
pip install -r requirements.txt
```

If you receive an ONNX or backend error, install the CPU backend explicitly:

```powershell
pip install "rembg[cpu]"
```

### 2. Node frontend

Install Node dependencies:

```powershell
npm install
```

Start the Next.js app:

```powershell
npm run dev
```

Open the UI at `http://127.0.0.1:3000`.

## How it works

- The browser uploads an image to `app/api/remove/route.ts`
- The server saves the file to `uploads/`
- A Python script at `scripts/remove_bg.py` calls `rembg` to remove the background
- The processed PNG is returned and downloaded automatically

## Project structure

- `app/` — Next.js app and API route
- `components/` — shadcn-style UI components
- `scripts/remove_bg.py` — Python background-removal bridge
- `requirements.txt` — Python dependencies for `rembg`
- `package.json` — Next.js dependencies and scripts
