# Implementation Plan - Web-based Todo List App

## Goal Description
Build a full-stack Todo List application with a REST API backend, MariaDB database, and a polished frontend.
- **Frontend**: HTML/CSS/Vanilla JS (Single Page Application feel).
- **Backend**: Node.js + Express.
- **Database**: MariaDB.
- **Auth**: JWT based authentication.

## User Review Required
> [!IMPORTANT]
> I will be using **JWT (JSON Web Tokens)** for authentication, stored in `localStorage` on the frontend. This is a common pattern for SPA + REST API demos.
> The database password is set to `dlrlqja1` as requested.

## Proposed Changes

### Database
#### [NEW] [schema.sql](file:///C:/Users/pc000/.gemini/antigravity/brain/0c6e298a-3be5-44fa-93cd-de0231dadda0/db/schema.sql)
- DDL for `users` table (id, email, password, nickname, created_at).
- DDL for `todos` table (id, user_id, title, content, deadline, priority, status, created_at).

### Backend (`/backend`)
#### [NEW] [package.json](file:///C:/Users/pc000/.gemini/antigravity/brain/0c6e298a-3be5-44fa-93cd-de0231dadda0/backend/package.json)
- Dependencies: `express`, `mysql2`, `bcrypt`, `jsonwebtoken`, `cors`, `dotenv`.

#### [NEW] [server.js](file:///C:/Users/pc000/.gemini/antigravity/brain/0c6e298a-3be5-44fa-93cd-de0231dadda0/backend/server.js)
- Entry point. Configures middleware (CORS, JSON body parser).

#### [NEW] [db.js](file:///C:/Users/pc000/.gemini/antigravity/brain/0c6e298a-3be5-44fa-93cd-de0231dadda0/backend/db.js)
- Database connection pool configuration.

#### [NEW] [routes/auth.js](file:///C:/Users/pc000/.gemini/antigravity/brain/0c6e298a-3be5-44fa-93cd-de0231dadda0/backend/routes/auth.js)
- `POST /signup`: Register new user.
- `POST /login`: Authenticate and return JWT.
- `POST /reset-password`: Mock password reset flow.

#### [NEW] [routes/todos.js](file:///C:/Users/pc000/.gemini/antigravity/brain/0c6e298a-3be5-44fa-93cd-de0231dadda0/backend/routes/todos.js)
- `GET /`: List todos (filter by status).
- `POST /`: Create todo.
- `PUT /:id`: Update todo.
- `DELETE /:id`: Delete todo.

#### [NEW] [middleware/auth.js](file:///C:/Users/pc000/.gemini/antigravity/brain/0c6e298a-3be5-44fa-93cd-de0231dadda0/backend/middleware/auth.js)
- Middleware to verify JWT and attach `user` to request.

### Frontend (`/frontend`)
#### [NEW] [index.html](file:///C:/Users/pc000/.gemini/antigravity/brain/0c6e298a-3be5-44fa-93cd-de0231dadda0/frontend/index.html)
- Single HTML file containing both Login/Signup views and Main Dashboard view (toggled via JS).

#### [NEW] [style.css](file:///C:/Users/pc000/.gemini/antigravity/brain/0c6e298a-3be5-44fa-93cd-de0231dadda0/frontend/style.css)
- CSS for Instagram-style login and Notion-style dashboard.

#### [NEW] [app.js](file:///C:/Users/pc000/.gemini/antigravity/brain/0c6e298a-3be5-44fa-93cd-de0231dadda0/frontend/app.js)
- Frontend logic: API calls, UI state management, Event listeners.

## Verification Plan
### Automated Tests
- N/A for this demo scope.

### Manual Verification
1.  **Setup**: Run SQL script in MariaDB. Start Backend. Open Frontend.
2.  **Auth**:
    - Sign up a new user.
    - Log in. Verify JWT is stored.
    - Log out. Verify JWT is removed.
3.  **Todo**:
    - Create a task. Check DB.
    - Edit task details.
    - Mark as done.
    - Delete task.
    - Create another user, ensure they cannot see the first user's tasks.
