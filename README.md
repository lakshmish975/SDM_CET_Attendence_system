# Apex Academy - CET & NEET Daily Student Management & WhatsApp Broadcast Suite (MERN Stack)

A full-stack **MERN (MongoDB, Express, React, Node.js)** web application built for Apex Coaching Academy to manage daily student attendance, track exam scorecards, automate parent communication via WhatsApp Web, and export multi-frequency Excel reports.

---

## 🚀 Key Features

### 1. 4 Distinct Student Categories & Complete Preloaded Roster (165 Students)
- **I PUC CET** (24 Enrolled Students - Engineering Stream)
- **I PUC NEET** (56 Enrolled Students - Medical Stream)
- **II PUC CET** (41 Enrolled Students - Senior Engineering Stream)
- **II PUC NEET** (44 Enrolled Students - Senior Medical Stream)
- Every student record includes: Roll Number, Full Name, Stream, Hostel/Local Type (MY3, AKSHARA, SVG, LOCAL, etc.), and Parent Mobile Number (+91).

### 2. Database Integration & Flexible Connection
- **Seamless MongoDB Support**:
  - Connect to MongoDB Atlas (cloud) or local MongoDB instance.
  - As requested, you can paste or update your connection string (`MONGODB_URI`) at any time:
    - **From the Web UI**: Click the **"Database Settings"** button in the header, paste your `mongodb+srv://...` string, and click **"Connect & Sync Database"**.
    - **From the Configuration File**: Paste your string into [`server/.env`](file:///C:/CET/server/.env) as `MONGODB_URI=...`.
  - **Automatic Seeding**: The moment MongoDB connects, the system automatically checks and seeds all 165 students and default group links into your database.
  - **Zero-Downtime Fallback**: If MongoDB is not yet configured, the system operates seamlessly in high-speed in-memory mode with all 165 students ready.

### 3. Multi-Option Excel File Extraction
Download customized `.xlsx` workbooks directly from the web interface:
- **Daily Attendance & Scorecard**: Includes roll numbers, names, present/absent status, marks scored, max marks, percentage (%), faculty name, subject, and automated academic remarks.
- **Weekly Attendance Matrix**: Multi-day grid (Mon-Sat) showing daily attendance marks, total present days, weekly attendance rate, and average test score.
- **Monthly Master Register**: Full 30/31-day attendance calendar with date-by-date columns, total Present/Absent counters, overall percentage, and attendance shortage alerts (<75%).
- **Instant Client-Side Export**: Immediately generates and downloads an Excel sheet incorporating any unsaved on-screen edits.

### 4. Auto-Send WhatsApp Web Broadcast Suite
- **Automated WhatsApp Web Dispatcher**:
  - Filter recipients: **All Absentees**, **Present Students**, **Low Scorers (<50%)**, or **All Students**.
  - Customizable template with dynamic placeholders (`{student_name}`, `{roll_no}`, `{status}`, `{score}`, `{max_score}`, `{pct}`, `{subject}`, `{faculty}`, `{date}`).
  - **Auto-Dispatch Mode**: Automatically opens WhatsApp Web tabs for each parent sequentially with configurable safety intervals (3s, 4s, 6s, 8s), accompanied by a live countdown and pause/resume controls.
  - Individual 1-click WhatsApp Web and SMS triggers.
- **WhatsApp Group Broadcasts**:
  - Direct dispatch buttons for **Absentees Group** and **Marks Group**.
  - 1-click formatted summary copy with emojis + automated launch of the respective WhatsApp group link.
  - Configurable group links for all 4 categories.

---

## 📁 Project Architecture

```
CET/
├── client/                     # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExcelExportModal.jsx       # Multi-frequency Excel extraction modal
│   │   │   ├── WhatsAppAutoSendModal.jsx  # Automated WhatsApp Web dispatcher
│   │   │   ├── DatabaseConfigModal.jsx    # Live MongoDB connection manager
│   │   │   ├── GroupConfigModal.jsx       # WhatsApp group links manager
│   │   │   └── StudentModal.jsx           # Add / Edit student details
│   │   ├── data/
│   │   │   └── defaultStudents.js         # Complete 165 preloaded students & fallbacks
│   │   ├── App.jsx                        # Main application layout & state
│   │   ├── index.css                      # Tailwind & custom scrollbar styles
│   │   └── main.jsx                       # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     # Backend (Node.js + Express + Mongoose)
│   ├── src/
│   │   ├── data/
│   │   │   └── studentsData.js            # 165 students dataset & default group links
│   │   ├── models/
│   │   │   ├── Student.js                 # Mongoose Student Schema
│   │   │   ├── Attendance.js              # Mongoose Attendance Session Schema
│   │   │   └── Settings.js                # Mongoose System Settings Schema
│   │   ├── routes/
│   │   │   ├── studentRoutes.js           # Student CRUD APIs
│   │   │   ├── attendanceRoutes.js        # Attendance session save & history APIs
│   │   │   ├── exportRoutes.js            # Daily/Weekly/Monthly Excel download APIs
│   │   │   └── settingsRoutes.js          # DB connect & group links APIs
│   │   ├── services/
│   │   │   └── excelService.js            # SheetJS (XLSX) workbook generator
│   │   ├── db.js                          # MongoDB connector & in-memory fallback
│   │   ├── seed.js                        # Standalone database seeder
│   │   └── server.js                      # Express HTTP server & static bundle provider
│   ├── .env                               # Environment variables (MONGODB_URI)
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root convenience scripts
└── README.md
```

---

## 🛠️ How to Run

### Step 1: Install Dependencies (Already Completed)
If setting up on a new machine:
```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

### Step 2: Configure Database (Optional)
Open [`server/.env`](file:///C:/CET/server/.env) and set your MongoDB URI:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cet_neet_db?retryWrites=true&w=majority
PORT=5000
```
*(Or leave it blank and paste it directly into the web UI via the **"Database Settings"** modal!)*

### Step 3: Start the Application

#### Option A: Production Mode (Single command - Server serves built Client)
```bash
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

#### Option B: Development Mode (Vite Hot-Reload)
In terminal 1 (Backend):
```bash
npm run server
```
In terminal 2 (Frontend with Hot-Reload):
```bash
npm run client
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📊 API Endpoints Quick Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health status and current DB connection info |
| `GET` | `/api/students?category=IPUC_CET` | Get students for category |
| `POST` | `/api/students` | Add a new student |
| `PUT` | `/api/students/:id` | Update student information |
| `DELETE` | `/api/students/:id` | Remove student |
| `GET` | `/api/attendance?date=...&category=...` | Get attendance session |
| `POST` | `/api/attendance` | Save / upsert daily attendance & test scores |
| `GET` | `/api/export/excel/daily?...` | Download Daily Attendance & Scorecard `.xlsx` |
| `GET` | `/api/export/excel/weekly?...` | Download Weekly Attendance Matrix `.xlsx` |
| `GET` | `/api/export/excel/monthly?...` | Download Monthly Master Register `.xlsx` |
| `POST` | `/api/settings/db-connect` | Dynamically update MongoDB URI & auto-seed |
| `GET` / `PUT` | `/api/settings/group-links` | Retrieve or save WhatsApp group invite links |
