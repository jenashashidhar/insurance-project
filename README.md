# Insurance Policy Management System
### Node.js + MySQL Web Application

---

## HOW TO RUN (Step by Step)

### Step 1 — Open the project in VS Code
Unzip the folder, then open it in VS Code.
Right-click the folder → "Open with Code"

---

### Step 2 — Open Terminal in VS Code
Menu → Terminal → New Terminal

---

### Step 3 — Install dependencies
```
npm install
```

---

### Step 4 — Setup MySQL Database
1. Open **phpMyAdmin** (http://localhost/phpmyadmin) or **MySQL Workbench**
2. Open the file `database.sql` from this project
3. Copy all contents and paste into phpMyAdmin SQL tab
4. Click **Go** / **Execute**

This creates the `insurance_db` database with all tables and sample data.

---

### Step 5 — Check MySQL password in app.js
Open `app.js` and find this section:
```js
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",   // ← Add your MySQL password here if needed
    database: "insurance_db"
});
```
If your MySQL has no password, leave it as `""`.

---

### Step 6 — Start the server
```
node app.js
```

You should see:
```
✅ MySQL Connected Successfully!
🚀 Server running at http://localhost:3000
```

---

### Step 7 — Open in browser
Go to: **http://localhost:3000**

---

## LOGIN CREDENTIALS

| Role     | Email              | Password |
|----------|--------------------|----------|
| Agent    | agent@gmail.com    | 123      |
| Customer | john@gmail.com     | 1234     |
| Customer | jane@gmail.com     | 1234     |

*(Or register a new customer account)*

---

## FEATURES

### Customer
- Register / Login
- Browse available insurance policies
- Apply for a policy
- Submit a claim with reason
- Check claim status by Claim ID
- View all my claims and applications

### Agent
- Login with fixed credentials
- Add new insurance policies
- Delete policies
- Update claim status (Pending / Approved / Rejected)
- Update application status
- Add payment records for customers
- View all claims and applications in tables

---

## PROJECT STRUCTURE

```
insurance_project/
├── app.js              ← Main server (Node.js + Express)
├── package.json        ← Dependencies
├── database.sql        ← Run this in MySQL first
├── README.md           ← This file
└── public/
    ├── login.html      ← Home page / Login
    ├── register.html   ← Customer registration
    ├── dashboard.html  ← Customer dashboard
    ├── agent.html      ← Agent dashboard
    ├── script.js       ← All frontend JavaScript
    └── style.css       ← Styling
```

---

## DATABASE TABLES

| Table        | Purpose                          |
|--------------|----------------------------------|
| users        | Customer accounts                |
| policies     | Insurance policies               |
| applications | Customer policy applications     |
| claims       | Customer claims                  |
| payments     | Payment records                  |
