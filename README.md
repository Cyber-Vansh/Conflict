# </> Conflict

## Project Overview
**Conflict** is a competitive coding battle platform — think of it as *chess.com, but for competitive programming*.
Users can compete against friends or other players in real time through coding battles.

The platform supports two types of matches:
- **Duals (1v1)** — classic one-on-one coding battles.
- **Havoc (Multiplayer)** — multiple users competing simultaneously.

Each user earns or loses **Crowns** (points) based on their performance in online battles.
Crowns are tracked separately for Duals and Havoc modes, and leaderboards (global and local) display rankings for both.

---

## Project Setup

### Folder Structure
```
conflict/
 ├── backend/
   ├── .env (not included)
 ├── frontend/
```

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the server:
   ```bash
   npm start
   ```

> **Note:**  
> The backend requires an `.env` file containing:
> - `PORT`
> - Judge0 API key to access the route that runs code
> - JWT secret for authentication  
> - DATABASE_URL for Prisma ORM
>  
> This file is not shared publicly for security reasons.

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

Once both servers are running, the app should be accessible at the specified frontend port (default: `http://localhost:3000`).

---

## Planned Features
- Online and friend battle modes  
- Problem upload feature (for friend battles)  
- Crowns system for ranking  
- Global and local leaderboards  
- Judge0-powered code execution and evaluation  
- Penalty and scoring system similar to standard CP platforms