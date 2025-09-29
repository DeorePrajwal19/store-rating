# FullStack Intern Coding Challenge - Minimal Implementation
## Tech stack
- Backend: Node.js + Express + Sequelize (Postgres)
- Frontend: React (Create React App)
- Database: PostgreSQL (SQL file provided)
## Setup (backend)
1. Install Node.js (v18+)
2. Create a PostgreSQL database named `fs_intern` and user `postgres` with password `password`, or set DATABASE_URL env var.
3. Backend:
    cd backend
    npm install
    # create .env if needed:
    # DATABASE_URL=postgres://postgres:password@localhost:5432/fs_intern
    npm run dev
## Setup (frontend)
Frontend code is inside `frontend` folder. Run `npm install` and `npm start`.
## Notes
- This is a minimal scaffold fulfilling requirements: user roles, sign up, login, admin routes, store listing, rating submission, owner dashboard.
- Form validations and sorting support are implemented on backend; frontend includes simple UI pages.
