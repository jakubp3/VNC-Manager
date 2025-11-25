# ManagerVNC Walkthrough

I have scaffolded the ManagerVNC project with the following structure:

## Infrastructure
- **docker-compose.yml**: Orchestrates Backend, Frontend, Postgres, and Nginx.
- **nginx/nginx.conf**: Reverse proxy configuration.

## Backend (`/backend`)
- **Dockerfile**: Node.js Alpine image with OpenSSL for Prisma.
- **package.json**: Express, Prisma, JWT, etc.
- **prisma/schema.prisma**: Database schema for Users, Machines, Favorites, and Logs.
- **src/server.ts**: Entry point.
- **src/routes/index.ts**: API route stubs.

## Frontend (`/frontend`)
- **Dockerfile**: Multi-stage build (Node build -> Nginx serve).
- **package.json**: React, Vite, Tailwind, noVNC.
- **src/App.tsx**: Main application component with routing and dark mode support.
- **tailwind.config.js**: Tailwind configuration with dark mode.

## Next Steps
1. Run `docker-compose up --build` to start the environment.
2. Implement the actual logic for the API endpoints in `backend/src/routes`.
3. Build out the React components in `frontend/src`.
