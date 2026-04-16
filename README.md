# AI Prompt Library (Angular + Django + PostgreSQL + Redis)

This project is a full-stack library application for managing AI image generation prompts.

## Tech Stack

- Frontend: Angular 17 (standalone components, reactive forms)
- Backend: Django 6 (function-based JSON APIs, no DRF)
- Database: PostgreSQL
- Cache: Redis (view counter source of truth)
- DevOps: Docker Compose

## Features Implemented

### Backend

Data model (`Prompt`):
- `id`: Integer primary key
- `title`: String
- `content`: Text
- `complexity`: Integer (1-10 by validation)
- `created_at`: Datetime (auto)

API endpoints:
- `GET /prompts/`: list all prompts
- `POST /prompts/`: create prompt
- `GET /prompts/:id/`: get one prompt + increment `view_count`

Redis integration:
- On each `GET /prompts/:id/`, Redis key `prompt:{id}:views` is incremented
- Returned field `view_count` comes directly from Redis

### Frontend

- Prompt List View (`/prompts`): title + complexity cards
- Prompt Detail View (`/prompts/:id`): content + live `view_count` polling
- Add Prompt View (`/prompts/new`): reactive form with validation
  - Title min 3 chars
  - Content min 20 chars
  - Complexity between 1 and 10

### DevOps

`docker-compose.yml` runs:
- `frontend` (Nginx serving Angular build)
- `backend` (Django)
- `db` (PostgreSQL)
- `redis` (Redis)

## Architecture Notes

- Django uses function-based views and `JsonResponse` for a simple, explicit API layer.
- Redis is intentionally treated as source of truth for view counts and not persisted in PostgreSQL.
- Angular uses a small service layer (`PromptsApiService`) for API communication.
- Basic CORS middleware is added in Django to allow Angular app access during local development.

## Run with Docker

From project root:

```bash
docker-compose up --build
```

App URLs:
- Frontend: http://localhost:4200
- Backend API: http://localhost:8000/prompts/

## Local (without Docker)

### One command start (PowerShell)

From project root:

```powershell
./run-dev.ps1
```

This starts backend and frontend in separate PowerShell windows.

Optional (same terminal, as background jobs):

```powershell
./run-dev.ps1 -NoNewWindows
```

### Backend

```bash
python -m venv .venv
.venv/Scripts/activate  # Windows PowerShell
pip install -r backend/requirements.txt
python manage.py migrate
python manage.py runserver
```

Set environment variables for local PostgreSQL/Redis if you are not using Docker.

Note: By default, backend runs with SQLite locally. To force PostgreSQL mode, set `USE_POSTGRES=true`.

### Frontend

```bash
cd frontend
npm install
npm start
```

## Bonus Features Status

- Authentication: not implemented
- Tagging system: not implemented
- Live hosting: not implemented

Priority was given to a clean and working core solution.
