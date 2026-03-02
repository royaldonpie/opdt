# Ogun Pathfinder Director Toolbox (OPDT)

A centralized digital reporting, exam vetting, and membership management system for Pathfinder Clubs under Ogun Conference.

## Prerequisites
- Node.js (v18+)
- PostgreSQL (v12+)

## Database Setup
1. Open PostgreSQL and create a database named `opdt`.
2. Run the SQL queries from `backend/db/schema.sql` to build the required tables.
3. Run the SQL queries from `backend/db/seed.sql` to preload the predefined Honors list.

## Backend Setup
1. Open a terminal and navigate to the `backend` folder: `cd backend`
2. (Optional) Create a `.env` file with the following variables if your database differs from the default:
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=opdt
   DB_PASSWORD=postgres
   DB_PORT=5432
   JWT_SECRET=supersecretkey
   PORT=5000
   ```
3. Install dependencies: `npm install`
4. Start the backend: `node server.js`
   
### Seed Initial Super Admin
When the backend is running for the first time, you must create an initial Super Admin to log into the system. Send a POST request (using cURL, Postman, or your browser's console) to the seed endpoint:
```sh
curl -X POST http://localhost:5000/api/auth/seed
```
This creates:
**Email:** admin@opt.com
**Password:** password123

## Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite React app: `npm run dev`
4. Open the URL shown in your terminal (usually http://localhost:5173). Log in with the standard admin credentials.

## Key Features Implemented
- **Exam Validation Engine**: Strict backend validation rules to verify the correct number of questions and structural combinations for different Pathfinder examination scenarios.
- **Role-Based Middlewares**: Prevents unauthorized access or dashboard spoofing. 
- **TailwindCSS + Lucide UI**: Compact, mobile-responsive layout relying on custom glassmorphism and deep accent colors.
- **File System Reporting System**: Uses `multer` for accepting Director-uploaded PDF Investiture and Induction structural reports securely.
