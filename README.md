# ManagerVNC

Full-stack VNC session manager built for multi-user remote access workflows.

## Tech Stack
- **Backend**: Node.js + Express (TypeScript), Prisma ORM, PostgreSQL
- **Frontend**: React + TypeScript, Tailwind, noVNC
- **Infrastructure**: Docker Compose, Nginx

## Getting Started

### Prerequisites
- Docker & Docker Compose

### Running the Application

1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8080/api

### Development

- **Backend**: Located in `backend/`.
- **Frontend**: Located in `frontend/`.

## Features
- Machine/session catalog
- Persistent VNC tabs
- Activity logging
- Dark mode
- Shared vs personal scopes

## License
MIT
