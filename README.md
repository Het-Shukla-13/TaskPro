# TaskPro - Task Management Web Application

TaskPro is a full-stack web application designed to help users manage their tasks efficiently. Users can create, update, view, and delete tasks. The project includes a separate frontend and backend, with MySQL as the database.

## Table of Contents
- [Features](#features)
- [Working Demo](#working-demo)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

---

## Features
- User registration and login with JWT authentication
- Create, update, delete tasks
- View all tasks in a dashboard
- Update user profile and password
- Delete account functionality
- Responsive frontend using Bootstrap
- REST API endpoints for all operations
- Cross-Origin Resource Sharing (CORS) support

---

## Working Demo:

[Click here to watch the demo video of TaskPro...](https://drive.google.com/file/d/15u1NgodcbAli1wzkknJgawHrWM41SFuL/view?usp=sharing)

---

## Technologies Used
- **Backend**: Django, Django REST Framework, Django Simple JWT
- **Frontend**: HTML, CSS, JavaScript, Bootstrap, FontAwesome
- **Database**: MySQL
- **Other Libraries**: django-filter, django-cors-headers, requests, mysqlclient

---

## Project Structure
```
TaskPro/
│
├─ backend/
├─├─ taskpro/
│   ├─ manage.py
│   ├─ taskpro/ (project settings)
│   ├─ tasks/ (app files)
│   └─ requirements.txt
│
├─ frontend/
│ ├─ index.html
│ ├─ dashboard.html
│ ├─ profile.html
| ├─ login.html
| ├─ register.html
│ ├─ userguide.html
| ├─ addtask.html
| ├─ taskdetail.html
| ├─ viewtasks.html
│ ├─ css/ (styleshhets for web pages)
│ ├─ js/
|   ├─ app.js
│ └─ images/
|   ├─OIP.webp
│
└─ README.md
```
---

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/Het-Shukla-13/TaskPro.git
cd TaskPro/backend/taskpro
```
---

### Setting up backend:

2. Create a Python/Conda virtual environment:
```bash
python -m venv venv
```

3. Activate the environment:

>Windows:
```bash
venv\Scripts\activate
```
>macOS/Linux:
```bash
source venv/bin/activate
```

4. Install dependencies
```bash
pip install -r requirements.txt
```

5. Configure MySQL

>Create a database (eg. taskpro_db) in MySQL.  
>Update taskpro/settings.py with your database credentials:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your_db_name',
        'USER': 'your_mysql_user',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

6. Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

7. Create admin(superuser):
```bash
python manage.py createsuperuser
```
### By default, the server runs at http://127.0.0.1:8000

---

### Setting up frontend

8. Open HTML files directly in a browser or use a static server as follows:
```bash 
python -m http.server 5500 --bind 127.0.0.1
```
---

### By default, the static server runs at http://127.0.0.1:5500

---

## API Endpoints:

| Endpoint       | Method             | Description                                 |  
| -------------- | ------------------ | ------------------------------------------- |
| `/register/`   | POST               | Register a new user                         |
| `/login/`      | POST               | Obtain JWT tokens                           |
| `/tasks/`      | GET, POST          | List or create tasks                        |
| `/tasks/<id>/` | GET, PATCH, DELETE | Retrieve, update, or delete a specific task |
| `/profile/`    | GET, PATCH, DELETE | View, update, or delete user profile        |

---

## Usage

1. Register a new user or log in.

2. Create tasks via the "Create Task" page.

3. View, update, or delete tasks in the "View Tasks" page.

4. Access and edit your profile in the "Profile" page.

5. Follow the "User Guide" page for detailed instructions.
