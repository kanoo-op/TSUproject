# Walkthrough - MyTodo App

I have successfully built the "MyTodo" application, a full-stack web app with MariaDB integration.

## 🏗️ Architecture
*   **Frontend**: Single Page Application (SPA) using HTML5, CSS3, and Vanilla JavaScript.
*   **Backend**: Node.js with Express.
*   **Database**: MariaDB with `users` and `todos` tables.

## ✅ Verification Steps

To verify the application works as expected, follow this flow:

1.  **Initialization**:
    *   Run the `db/schema.sql` script in your MariaDB instance.
    *   Run `npm install` and `npm start` in the `backend/` folder.
    *   Go to `http://localhost:3000`.

2.  **User Flow**:
    *   **Sign Up**: Click "Sign up", enter details (e.g., `test@example.com`, `Tester`, `password123`).
    *   **Log In**: Use the credentials to log in. You should see the main dashboard.
    *   **Create Task**: Type "Buy Groceries" in the top input and hit Enter.
    *   **Edit Task**: Click the "Buy Groceries" item. The right sidebar opens.
        *   Add a note: "Milk, Eggs, Bread".
        *   Change Priority to "HIGH".
        *   Set a Deadline.
    *   **Filter**: Click "Doing" in the sidebar. The list should update (likely empty). Change the task status to "DOING" in the sidebar, and it should appear.
    *   **Search**: Type "Groceries" in the top search bar.
    *   **Log Out**: Click "Log Out" in the sidebar. You should return to the login screen.

## 🎨 UI Highlights
*   **Login**: Clean, centered card design inspired by Instagram.
*   **Dashboard**: Sidebar navigation + Main list + Side detail panel, inspired by Notion/Keep.
*   **Responsive**: Layout adjusts flex directions for smaller screens (basic support).

## 📄 Artifacts
*   [README.md](file:///C:/Users/pc000/.gemini/antigravity/brain/0c6e298a-3be5-44fa-93cd-de0231dadda0/README.md): Full setup instructions.
*   [Source Code](file:///C:/Users/pc000/.gemini/antigravity/brain/0c6e298a-3be5-44fa-93cd-de0231dadda0/): Complete project files.
