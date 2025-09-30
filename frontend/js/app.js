const API_URL='http://127.0.0.1:8000/api';
let accesstoken = localStorage.getItem('accesstoken')||null;
let refreshtoken = localStorage.getItem('refreshtoken')||null;

// Function to refresh access token
async function refreshAccessToken(){
    if(!refreshtoken) return false;
    try{
         const response = await fetch(`${API_URL}/token/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshtoken })
        });
        if (response.ok) {
            const data = await response.json();
            accessToken = data.access;
            localStorage.setItem('accesstoken', accesstoken);
            // do we set new refresh token too?
            return true; 
        } else {
            logoutUser();
            return false;
        }
    }
    catch (error) {
        console.error("Error refreshing token:", error);
        logoutUser();
        return false;
    }
}

// Function to handle fetch with jwt-token
async function fetchWithAuth(url, options = {}){
    if (!options.headers) options.headers = {};
    if (!accesstoken) {
        window.location.href = 'login.html';
        return;
    }
    options.headers['Authorization'] = `Bearer ${accesstoken}`;
    let res=await fetch(url, options);
    if (res.status===401) {
        const refresh = await refreshAccessToken();
        if (!refresh) return res; 
        options.headers['Authorization'] = `Bearer ${accesstoken}`;
        res = await fetch(url, options);
    }
    return res;
}

// Function to handle user registration
async function registerUser(event) {
    event.preventDefault();
    const username=document.getElementById('username').value;
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    try {
        console.log(JSON.stringify({ username, email, password }));
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        if (response.ok) {
            alert('Registration successful! Please log in.');
            window.location.href = 'login.html';
        } else {
            const data = await response.json();
            alert(`Registration failed: ${data.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

// Function to handle user login
async function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            const data = await response.json();
            accessToken = data.access;
            refreshToken = data.refresh;
            localStorage.setItem('accesstoken', accessToken);
            localStorage.setItem('refreshtoken', refreshToken);
            localStorage.setItem('username', username);

            window.location.href = 'dashboard.html';
        } else {
            const data = await response.json();
            alert(`Login failed: ${data.error || 'Unknown error'}`);
        }   
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

// Function to handle logout
function logoutUser() {
    localStorage.removeItem('accesstoken'); 
    localStorage.removeItem('refreshtoken');
    localStorage.removeItem('username');
    accesstoken=null
    refreshtoken=null
    window.location.href = 'index.html';
}

// API Calls for Tasks CRUD.

// Creating a single task
async function createTask(event) {
    if (event) event.preventDefault();
    const title=document.getElementById('title').value;
    const description=document.getElementById('description').value;
    const priority=document.getElementById('priority').value;
    const due_date=document.getElementById('due_date').value; 
    const status=document.getElementById('status').value;

    try {
        const res=await fetchWithAuth(`${API_URL}/tasks/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, priority, due_date, status: status })
        });
        if (res && res.ok) {
            alert('Task created');
            window.location.href = 'viewtasks.html';
        } else {
            const data = await res.json().catch(()=>({detail:'error'}));
            alert('Create failed: ' + JSON.stringify(data));
        }
    } catch (err) {
        console.error(err);
        alert('An error occured while creating the task!');
    }
}

// Function to build query string for searching, filtering and ordering
function buildTaskQuery() {
    const query_components=[];
    const search=document.getElementById('searchQuery').value;
    const filterByPriority=document.getElementById('filterByPriority').value;
    const filterByStatus=document.getElementById('filterByStatus').value;
    const orderBy=document.getElementById('orderBy').value;

    if (search) query_components.push(`search=${encodeURIComponent(search)}`);
    if (filterByPriority) query_components.push(`priority=${encodeURIComponent(filterByPriority)}`);
    if (filterByStatus) query_components.push(`status=${encodeURIComponent(filterByStatus)}`);
    if (orderBy) query_components.push(`ordering=${orderBy === 'asc' ? 'due_date' : '-due_date'}`);
    
    if(query_components.length)
        return `?${query_components.join('&')}`;
    else
        return '';
}

// Function to retrieve the tasks for rendering
async function loadTasks() {
    const query_str=buildTaskQuery();
    try {
        const res = await fetchWithAuth(`${API_URL}/tasks/${query_str}`, { method: 'GET' });
        if (!res) return;
        if (!res.ok) {
            const d = await res.json().catch(()=>({detail:'error'}));
            console.error('Load tasks failed', d);
            return;
        }
        const tasks = await res.json();
        renderTaskList(tasks);
    } catch (err) {
        console.error(err);
    }
}

// Function to render the tasks into the HTML Page
function renderTaskList(tasks) {
    const container = document.getElementById('taskList');
    container.innerHTML = ''; 

    if (!tasks.length) {
        container.innerHTML = '<p>No tasks found.</p>';
        return;
    }

    tasks.forEach(task => {
       
        const status=task.status;
        const due_date=task.due_date;
        const title=task.title;
        const description=task.description;
        const priority=task.priority;

        // let headerClass = "";
        let statusText = "Unknown";

        if(status=='completed'){
            headerClass='bg-success';      
            statusText="Completed";
        } else if(status=='in_progress'){
            headerClass='bg-warning';
            statusText="In Progress"; 
        } else if(status=='pending'){
            headerClass='bg-danger';
            statusText="Pending";
        }
        
        const content = description.length > 50 ? description.substring(0,50) + '...' : description;

        const card = document.createElement('div');

        const header=`<div class="${headerClass} card-header"><h5>Task ${escapeHtml(statusText)}</h5></div>`;
        const body=`<div class="card-body">
                <h5 class="card-title">${escapeHtml(title)}</h5>
                <p class="text-muted">${escapeHtml(due_date)}</p>
                <p class="card-text">${escapeHtml(content)}</p>
            </div>`;
        const footer=`<div class="card-footer d-flex justify-content-between align-items-center">
                <span class="fw-bold">Priority: ${escapeHtml(task.priority)}</span>
                <div>
                    <button class="btn btn-sm btn-primary me-2" data-id="${task.id}" data-action="open">View Task</button>
                    ${status !== 'completed' ? `<button class="btn btn-sm btn-success me-2" data-id="${task.id}" data-action="complete">Mark Complete</button>` : ''}
                    <button class="btn btn-sm btn-danger" data-id="${task.id}" data-action="delete">Delete</button>
                </div>
                </div>`
        card.className = 'card';
        card.innerHTML=header+body+footer;
        

        //doing event delegation via dataset
        card.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const action = e.currentTarget.dataset.action;
                if (action === 'open') window.location.href = `taskdetail.html?id=${id}`;
                else if (action === 'complete') markComplete(id);
                else if (action === 'delete') deleteTask(id);
            });
        });
        container.appendChild(card);
    });
}

async function viewTask(id) {
    const form = document.getElementById('taskForm');
    if (!form) return; 

    try {
        const res = await fetchWithAuth(`${API_URL}/tasks/${id}/`, { method: 'GET' });
        if (!res.ok) throw new Error('Task not found');
        const task = await res.json();

        document.getElementById('title').value = task.title || '';
        document.getElementById('description').value = task.description || '';
        document.getElementById('priority').value = task.priority || 'low';
        document.getElementById('status').value = task.status || 'pending';
        document.getElementById('due').value = task.due_date ? task.due_date.split('T')[0] : '';
        form.onsubmit = (e) => updateTask(e, id);
        document.getElementById('deleteBtn').onclick = () => deleteTask(id);
    } catch (err) {
        console.error(err);
        alert('Could not load task');
    }
}

// Function to Update Task
async function updateTask(event, id) {
    event.preventDefault(); 
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const status = document.getElementById('status').value;
    const due_date = document.getElementById('due').value;
    try {
        const res = await fetchWithAuth(`${API_URL}/tasks/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, priority, status, due_date })
        });

        if (res.ok) {
            alert('Task updated successfully!');
            window.location.href="viewtasks.html"
        } else {
            const data = await res.json().catch(() => ({ detail: 'error' }));
            alert('Update failed: ' + JSON.stringify(data));
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred while updating the task.');
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const res = await fetchWithAuth(`${API_URL}/tasks/${id}/`, { method: 'DELETE' });

        if (res.ok) {
            alert('Task deleted successfully!');
            window.location.href = 'viewtasks.html';
        } else {
            const data = await res.json().catch(() => ({ detail: 'error' }));
            alert('Delete failed: ' + JSON.stringify(data));
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred while deleting the task.');
    }
}

async function markComplete(id) {
    try {
        const task_mark= await fetchWithAuth(`${API_URL}/tasks/${id}/`);
        if (!task_mark.ok) throw new Error('Task not found');
        const task = await task_mark.json();

        const res=await fetchWithAuth(`${API_URL}/tasks/${id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'completed',
            })
        });

        if (res.ok) {
            alert('Task marked as completed!');
            loadTasks();
        } else {
            const data = await res.json().catch(() => ({ detail: 'error' }));
            alert('An error occured while marking the task complete: ' + JSON.stringify(data));
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred while marking the task complete.');
    }
}

// Profile Handling

// Function to got to profile page
function goToProfile(event) {
    event.preventDefault();
    localStorage.setItem('lastPage', window.location.href);  
    // what if we don't writ below line?
    window.location.href = 'profile.html';
}

// Function to load profile
async function loadProfile() {
    try {
        const res = await fetchWithAuth(`${API_URL}/profile`, { method: 'GET' });
        if (!res.ok) throw new Error("Failed to load profile");
        const user = await res.json();

        document.getElementById("profileUsername").value = user.username;
        document.getElementById("profileEmail").value = user.email;
    } catch (err) {
        console.error(err);
        alert("Could not load profile info.");
    }
}

async function updateProfile(event) {
    event.preventDefault();
    const username = document.getElementById("profileUsername").value;
    const email = document.getElementById("profileEmail").value;
    const password = document.getElementById("profilePassword").value;

    const body = { username, email };
    if (password) body.password = password;

    try {
        const res = await fetchWithAuth(`${API_URL}/profile`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            alert("Profile updated!");
        } else {
            const data = await res.json().catch(() => ({}));
            alert("Update failed: " + JSON.stringify(data));
        }
    } catch (err) {
        console.error(err);
        alert("Error updating profile.");
    }
}

async function deleteAccount() {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
        const res = await fetchWithAuth(`${API_URL}/profile`, { method: 'DELETE' });
        if (res.ok) {
            alert("Account deleted.");
            logoutUser(); 
        } else {
            alert("Failed to delete account.");
        }
    } catch (err) {
        console.error(err);
        alert("Error deleting account.");
    }
}

// Function to define escape HTML
function escapeHtml(str) {
    if (!str && str!==0) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// Adding event-listeners
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    // Login page
    if (path.endsWith("login.html")) {
        document.getElementById("loginForm").addEventListener("submit", loginUser);
    }

    // Register page
    if (path.endsWith("register.html")) {
        document.getElementById("registerForm").addEventListener("submit", registerUser);
    }

    // Task List page 
    if (path.endsWith("viewtasks.html")) {
        loadTasks();
        document.getElementById("searchForm").addEventListener("submit", (e) => {
            e.preventDefault();
            loadTasks();
        });
    }

    if (path.endsWith("addtask.html")) {
        document.getElementById("taskForm").addEventListener("submit", createTask);
    }

    if (path.endsWith("taskdetail.html")) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (id) viewTask(id);
    }

    // Profile page
    if (path.endsWith("profile.html")) {
        loadProfile();
        document.getElementById("profileForm").addEventListener("submit", updateProfile);
        document.getElementById("deleteAccountBtn").addEventListener("click", deleteAccount);
        document.getElementById("logoutBtn").addEventListener("click", logoutUser);
        document.getElementById("backBtn").addEventListener("click", (e) => {
            e.preventDefault();
            const last = localStorage.getItem("lastPage") || "dashboard.html";
            window.location.href = last;
        });
    }
});