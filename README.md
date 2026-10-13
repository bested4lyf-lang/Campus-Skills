# CampusSkill — Student Skills & Service Marketplace

A peer-to-peer student marketplace where students can discover, offer, and request skills and services from their campus peers. Every registered user is a **Student** who can act as both a **Service Provider** and a **Customer**.

---

## 🛠️ Tech Stack
- **Backend**: Django 6.0, Django REST Framework (DRF), django-cors-headers, SQLite (Dev)
- **Frontend**: React 19, TypeScript, Vite
- **Repository Structure**: Monorepo (`/backend` and `/frontend`)

---

## 🚀 Quickstart for Team Members

### 1. Clone the Repository
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd "Gravity Projects" # (or your repo folder name)
```

---

### 2. Backend Setup (Django)

Open a terminal and navigate to the backend directory:
```bash
cd backend

# (Optional but recommended) Create and activate a virtual environment:
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies:
pip install -r requirements.txt

# Run database migrations:
python manage.py migrate

# Create an admin superuser:
python manage.py createsuperuser

# Start the Django API server (runs on http://127.0.0.1:8000):
python manage.py runserver
```

---

### 3. Frontend Setup (React + TypeScript)

Open a **separate** terminal and navigate to the frontend directory:
```bash
cd frontend

# Install Node dependencies:
npm install

# Start the Vite development server (runs on http://localhost:5173):
npm run dev
```

Visit **http://localhost:5173** in your browser. The app will automatically connect to the Django API backend!

---

## 👥 Team Workflow & Sprint 1 Responsibilities

| Role | Members | Focus |
| :--- | :--- | :--- |
| **Team Lead & UI/UX** | Lead | Wireframes, UI/UX consistency, API contract alignment, GitHub PR reviews |
| **Backend** | 2 Devs | `apps/accounts` (Auth, Profiles), `apps/services` (Categories, Listings), `apps/requests` (State machine) |
| **Frontend** | 2 Devs | React components, API integration (`axios`/`fetch`), Catalog filters, Request modals |

---

## ⚠️ Important Team Rules
1. **Never commit `db.sqlite3`**: Each developer has their own local database. Only migration files (`000x_*.py`) are tracked in Git.
2. **Always pull before starting work**: Run `git pull origin main` and `python manage.py migrate` before creating a new branch.
3. **Use Feature Branches**: Never push directly to `main`. Create branches like `feat/backend-auth` or `feat/frontend-cards` and submit Pull Requests.
