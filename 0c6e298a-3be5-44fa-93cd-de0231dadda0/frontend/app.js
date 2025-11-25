const API_URL = 'http://localhost:3000/api';

// State
let currentUser = null;
let todos = [];
let currentFilter = 'all';
let currentSearch = '';
let selectedTodoId = null;

// DOM Elements
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const resetForm = document.getElementById('resetForm');
const todoListEl = document.getElementById('todoList');
const detailPanel = document.getElementById('detail-panel');

// --- Auth Functions ---

function checkAuth() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
        currentUser = JSON.parse(userStr);
        showApp();
    } else {
        showAuth();
    }
}

function showAuth() {
    authContainer.classList.remove('hidden');
    appContainer.classList.add('hidden');
}

function showApp() {
    authContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    document.getElementById('userNickname').textContent = currentUser.nickname;
    fetchTodos();
}

async function login(email, password) {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            showApp();
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Login failed');
    }
}

async function signup(email, nickname, password) {
    try {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, nickname, password })
        });
        const data = await res.json();
        if (res.ok) {
            alert('Signup successful! Please log in.');
            document.getElementById('showLogin').click();
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Signup failed');
    }
}

async function resetPassword(email, newPassword) {
    try {
        const res = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword })
        });
        const data = await res.json();
        if (res.ok) {
            alert('Password reset successful! Please log in.');
            document.getElementById('backToLogin').click();
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Reset failed');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    showAuth();
}

// --- Todo Functions ---

async function fetchTodos() {
    const token = localStorage.getItem('token');
    let url = `${API_URL}/todos?`;
    if (currentFilter !== 'all') url += `status=${currentFilter}&`;
    if (currentSearch) url += `search=${currentSearch}`;

    try {
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            todos = await res.json();
            renderTodos();
        } else if (res.status === 401 || res.status === 403) {
            logout();
        }
    } catch (err) {
        console.error(err);
    }
}

async function createTodo(title) {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title })
        });
        if (res.ok) {
            fetchTodos();
        }
    } catch (err) {
        console.error(err);
    }
}

async function updateTodo(id, updates) {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });
        if (res.ok) {
            // Update local state to reflect changes immediately in list if needed
            // But fetching fresh is safer
            fetchTodos();
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            closeDetail();
            fetchTodos();
        }
    } catch (err) {
        console.error(err);
    }
}

// --- UI Functions ---

function renderTodos() {
    todoListEl.innerHTML = '';
    todos.forEach(todo => {
        const el = document.createElement('div');
        el.className = 'todo-item';
        el.onclick = () => openDetail(todo);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.status === 'DONE';
        checkbox.onclick = (e) => {
            e.stopPropagation();
            const newStatus = checkbox.checked ? 'DONE' : 'TODO';
            updateTodo(todo.id, { status: newStatus });
        };

        const title = document.createElement('div');
        title.className = 'todo-title';
        title.textContent = todo.title;
        if (todo.status === 'DONE') title.style.textDecoration = 'line-through';

        const meta = document.createElement('div');
        meta.className = 'todo-meta';

        const prioritySpan = document.createElement('span');
        prioritySpan.className = `priority-badge priority-${todo.priority}`;
        prioritySpan.textContent = todo.priority;

        meta.appendChild(prioritySpan);

        el.appendChild(checkbox);
        el.appendChild(title);
        el.appendChild(meta);

        todoListEl.appendChild(el);
    });
}

function openDetail(todo) {
    selectedTodoId = todo.id;
    detailPanel.classList.add('open');

    document.getElementById('detailTitle').value = todo.title;
    document.getElementById('detailContent').value = todo.content || '';
    document.getElementById('detailStatus').value = todo.status;
    document.getElementById('detailPriority').value = todo.priority;

    // Format date for input type=date (YYYY-MM-DD)
    if (todo.deadline) {
        const date = new Date(todo.deadline);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        document.getElementById('detailDeadline').value = `${yyyy}-${mm}-${dd}`;
    } else {
        document.getElementById('detailDeadline').value = '';
    }
}

function closeDetail() {
    selectedTodoId = null;
    detailPanel.classList.remove('open');
}

// --- Event Listeners ---

// Auth Switchers
document.getElementById('showSignup').onclick = (e) => {
    e.preventDefault();
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('login-switch').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
    document.getElementById('signup-switch').classList.remove('hidden');
};

document.getElementById('showLogin').onclick = (e) => {
    e.preventDefault();
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('signup-switch').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('login-switch').classList.remove('hidden');
};

document.getElementById('forgotPasswordLink').onclick = (e) => {
    e.preventDefault();
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('login-switch').classList.add('hidden');
    document.getElementById('reset-form').classList.remove('hidden');
};

document.getElementById('backToLogin').onclick = (e) => {
    e.preventDefault();
    document.getElementById('reset-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('login-switch').classList.remove('hidden');
};

// Forms
loginForm.onsubmit = (e) => {
    e.preventDefault();
    login(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value);
};

signupForm.onsubmit = (e) => {
    e.preventDefault();
    signup(
        document.getElementById('signupEmail').value,
        document.getElementById('signupNickname').value,
        document.getElementById('signupPassword').value
    );
};

resetForm.onsubmit = (e) => {
    e.preventDefault();
    resetPassword(document.getElementById('resetEmail').value, document.getElementById('resetNewPassword').value);
};

document.getElementById('logoutBtn').onclick = logout;

// App Navigation
document.querySelectorAll('.nav-item[data-filter]').forEach(el => {
    el.onclick = () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        el.classList.add('active');
        currentFilter = el.dataset.filter;
        document.getElementById('pageTitle').textContent = el.textContent.trim();
        fetchTodos();
    };
});

document.getElementById('searchInput').oninput = (e) => {
    currentSearch = e.target.value;
    fetchTodos();
};

document.getElementById('newTodoInput').onkeypress = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
        createTodo(e.target.value.trim());
        e.target.value = '';
    }
};

// Detail View Actions
document.getElementById('closeDetailBtn').onclick = closeDetail;

// Auto-save details on change
const detailInputs = ['detailTitle', 'detailContent', 'detailStatus', 'detailPriority', 'detailDeadline'];
detailInputs.forEach(id => {
    document.getElementById(id).onchange = () => {
        if (!selectedTodoId) return;

        const updates = {};
        if (id === 'detailTitle') updates.title = document.getElementById(id).value;
        if (id === 'detailContent') updates.content = document.getElementById(id).value;
        if (id === 'detailStatus') updates.status = document.getElementById(id).value;
        if (id === 'detailPriority') updates.priority = document.getElementById(id).value;
        if (id === 'detailDeadline') updates.deadline = document.getElementById(id).value;

        updateTodo(selectedTodoId, updates);
    };
});

document.getElementById('deleteTodoBtn').onclick = () => {
    if (selectedTodoId) deleteTodo(selectedTodoId);
};

// Init
checkAuth();
