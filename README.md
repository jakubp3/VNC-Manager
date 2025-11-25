# ManagerVNC

Full-stack VNC session manager built for multi-user remote access workflows with web-based authentication and role-based access control.

## Tech Stack
- **Backend**: Node.js + Express (TypeScript), Prisma ORM, PostgreSQL, JWT authentication
- **Frontend**: React + TypeScript + Vite, Tailwind CSS (dark mode), noVNC integration
- **Infrastructure**: Docker Compose, Nginx reverse proxy

## Features
- **Authentication**: JWT-based login/register system
- **Role-Based Access**: Admin and User roles with different permissions
- **VNC Management**: Create, edit, delete VNC machine configurations
- **Shared vs Personal**: Admins create shared machines, users create personal ones
- **Tabbed Sessions**: Open multiple VNC connections in browser tabs
- **Admin Panel**: User management, role assignment, user deletion
- **Dark Mode**: Full dark mode support across the application

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jakubp3/VNC-Manager.git
   cd VNC-Manager
   ```

2. **Build and start the containers**:
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

3. **Initialize the database**:
   ```bash
   # The database will be automatically initialized by Prisma
   # Wait ~30 seconds for services to start
   ```

4. **Create the first admin user**:
   ```bash
   docker exec -it vnc-manager-backend-1 npm run create-admin
   ```
   Enter email and password when prompted.

5. **Access the application**:
   - **Frontend**: http://localhost:9002
   - **Backend API**: http://localhost:9001/api
   - **noVNC**: http://localhost:6080/vnc.html
   - **Nginx (reverse proxy)**: http://localhost:9003

### Default Ports
- `9001`: Backend API
- `9002`: Frontend web app
- `9003`: Nginx reverse proxy
- `6080`: noVNC web client
- `5432`: PostgreSQL (internal only)

## Usage

### For Users
1. Register an account or login
2. View shared machines (created by admins)
3. Create your own personal VNC machines
4. Click "Open" to connect to a VNC machine in a new tab
5. Switch between tabs to manage multiple sessions

### For Admins
1. Access the Admin Panel from the dashboard
2. Manage users (promote/demote roles, delete users)
3. Create shared VNC machines visible to all users
4. All admin users can manage shared machines

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user info

### VNC Machines
- `GET /api/vnc-machines` - List accessible machines
- `POST /api/vnc-machines` - Create new machine
- `GET /api/vnc-machines/:id` - Get machine details
- `PATCH /api/vnc-machines/:id` - Update machine
- `DELETE /api/vnc-machines/:id` - Delete machine

### Users (Admin Only)
- `GET /api/users` - List all users
- `PATCH /api/users/:id` - Update user role
- `DELETE /api/users/:id` - Delete user

## Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT tokens

### Frontend
- `VITE_API_URL`: Backend API URL (default: http://localhost:9001/api)

## Security Notes

> **⚠️ Production Considerations**:
> - VNC passwords are stored in plain text. Use encryption or a secrets vault in production.
> - JWT tokens are stored in localStorage. Consider httpOnly cookies for better security.
> - Change the default `JWT_SECRET` in production.
> - Use HTTPS in production environments.

## License
MIT
