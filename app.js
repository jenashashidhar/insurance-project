const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// =====================================
// MYSQL CONNECTION
// =====================================

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",          // <-- Change to your MySQL password if any
    database: "insurance_db"
});


// =====================================
// CONNECT DATABASE
// =====================================

db.connect((err) => {
    if (err) {
        console.log("❌ MySQL Connection Error:", err.message);
        console.log("Make sure MySQL is running and insurance_db database exists.");
        return;
    }
    console.log("✅ MySQL Connected Successfully!");
});


// =====================================
// HOME PAGE → LOGIN
// =====================================

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});


// =====================================
// LOGIN PAGE
// =====================================

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});


// =====================================
// LOGIN USER
// =====================================

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.send("Please enter email and password");
    }

    // AGENT LOGIN (hardcoded)
    if (email === "agent@gmail.com" && password === "123") {
        return res.send("admin Success");
    }

    // CUSTOMER LOGIN
    const SQL_Query = "SELECT * FROM users WHERE email=? AND password=?";

    db.query(SQL_Query, [email, password], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        if (result.length > 0) {
            res.json({ message: "Success", user: result[0] });
        } else {
            res.send("Invalid Credentials");
        }
    });
});


// =====================================
// REGISTER PAGE
// =====================================

app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/public/register.html");
});


// =====================================
// REGISTER USER
// =====================================

app.post("/register", (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.send("All fields are required");
    }

    // Check if email already exists
    db.query("SELECT * FROM users WHERE email=?", [email], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        if (result.length > 0) {
            return res.send("Email already registered");
        }

        const SQL_Query = "INSERT INTO users (name, email, password) VALUES (?,?,?)";

        db.query(SQL_Query, [name, email, password], (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Registration Failed");
            }

            res.send("Success");
        });
    });
});


// =====================================
// CUSTOMER DASHBOARD
// =====================================

app.get("/dashboard", (req, res) => {
    res.sendFile(__dirname + "/public/dashboard.html");
});


// =====================================
// AGENT PAGE
// =====================================

app.get("/agent", (req, res) => {
    res.sendFile(__dirname + "/public/agent.html");
});


// =====================================
// ADD POLICY
// =====================================

app.post("/add-policy", (req, res) => {

    const { policy_name, policy_amount, policy_duration, description } = req.body;

    if (!policy_name || !policy_amount || !policy_duration || !description) {
        return res.send("All policy fields are required");
    }

    const SQL_Query = `
        INSERT INTO policies (policy_name, policy_amount, policy_duration, description)
        VALUES (?, ?, ?, ?)
    `;

    db.query(SQL_Query, [policy_name, policy_amount, policy_duration, description], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Policy Add Failed");
        }

        res.send("Policy Added Successfully");
    });
});


// =====================================
// DELETE POLICY
// =====================================

app.post("/delete-policy", (req, res) => {

    const { policy_id } = req.body;

    db.query("DELETE FROM policies WHERE id=?", [policy_id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Delete Failed");
        }

        res.send("Policy Deleted Successfully");
    });
});


// =====================================
// VIEW ALL POLICIES
// =====================================

app.get("/view-policies", (req, res) => {

    db.query("SELECT * FROM policies ORDER BY id DESC", (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Error");
        }

        res.json(result);
    });
});


// =====================================
// APPLY POLICY (CUSTOMER)
// =====================================

app.post("/apply-policy", (req, res) => {

    const { customer_id, policy_id } = req.body;

    if (!customer_id || !policy_id) {
        return res.send("Customer ID and Policy ID are required");
    }

    const SQL_Query = `
        INSERT INTO applications (customer_id, policy_id, status)
        VALUES (?, ?, ?)
    `;

    db.query(SQL_Query, [customer_id, policy_id, "Pending"], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Policy Application Failed");
        }

        res.send("Policy Applied Successfully");
    });
});


// =====================================
// UPDATE APPLICATION STATUS (AGENT)
// =====================================

app.post("/update-application", (req, res) => {

    const { application_id, status } = req.body;

    db.query("UPDATE applications SET status=? WHERE id=?", [status, application_id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Update Failed");
        }

        res.send("Application Updated Successfully");
    });
});


// =====================================
// VIEW ALL APPLICATIONS (AGENT)
// =====================================

app.get("/view-applications", (req, res) => {

    const SQL_Query = `
        SELECT applications.*, users.name AS customer_name, policies.policy_name
        FROM applications
        LEFT JOIN users ON applications.customer_id = users.id
        LEFT JOIN policies ON applications.policy_id = policies.id
        ORDER BY applications.id DESC
    `;

    db.query(SQL_Query, (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Error");
        }

        res.json(result);
    });
});


// =====================================
// VIEW MY APPLICATIONS (CUSTOMER)
// =====================================

app.get("/my-applications/:customer_id", (req, res) => {

    const customer_id = req.params.customer_id;

    const SQL_Query = `
        SELECT applications.*, policies.policy_name
        FROM applications
        LEFT JOIN policies ON applications.policy_id = policies.id
        WHERE applications.customer_id = ?
        ORDER BY applications.id DESC
    `;

    db.query(SQL_Query, [customer_id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Error");
        }

        res.json(result);
    });
});


// =====================================
// SUBMIT CLAIM (CUSTOMER)
// =====================================

app.post("/submit-claim", (req, res) => {

    const { customer_id, policy_id, claim_reason } = req.body;

    if (!customer_id || !policy_id || !claim_reason) {
        return res.json({ message: "All fields are required", claim_id: null });
    }

    const SQL_Query = `
        INSERT INTO claims (customer_id, policy_id, claim_reason, claim_status)
        VALUES (?, ?, ?, ?)
    `;

    db.query(SQL_Query, [customer_id, policy_id, claim_reason, "Pending"], (err, result) => {

        if (err) {
            console.log("CLAIM ERROR:", err.message);
            return res.json({ message: "Claim Submission Failed: " + err.message, claim_id: null });
        }

        res.json({
            message: "Claim Submitted Successfully",
            claim_id: result.insertId
        });
    });
});


// =====================================
// UPDATE CLAIM STATUS (AGENT)
// =====================================

app.post("/update-claim", (req, res) => {

    const { claim_id, claim_status } = req.body;

    db.query("UPDATE claims SET claim_status=? WHERE id=?", [claim_status, claim_id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Claim Update Failed");
        }

        res.send("Claim Updated Successfully");
    });
});


// =====================================
// CHECK CLAIM STATUS BY ID (CUSTOMER)
// =====================================

app.get("/claim-status/:id", (req, res) => {

    const claim_id = req.params.id;

    db.query("SELECT * FROM claims WHERE id=?", [claim_id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Error");
        }

        res.json(result);
    });
});


// =====================================
// VIEW ALL CLAIMS (AGENT)
// =====================================

app.get("/view-claims", (req, res) => {

    const SQL_Query = `
        SELECT claims.*, users.name AS customer_name, policies.policy_name
        FROM claims
        LEFT JOIN users ON claims.customer_id = users.id
        LEFT JOIN policies ON claims.policy_id = policies.id
        ORDER BY claims.id DESC
    `;

    db.query(SQL_Query, (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Error");
        }

        res.json(result);
    });
});


// =====================================
// VIEW MY CLAIMS (CUSTOMER)
// =====================================

app.get("/my-claims/:customer_id", (req, res) => {

    const customer_id = req.params.customer_id;

    const SQL_Query = `
        SELECT claims.*, policies.policy_name
        FROM claims
        LEFT JOIN policies ON claims.policy_id = policies.id
        WHERE claims.customer_id = ?
        ORDER BY claims.id DESC
    `;

    db.query(SQL_Query, [customer_id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Error");
        }

        res.json(result);
    });
});


// =====================================
// ADD PAYMENT (AGENT)
// =====================================

app.post("/add-payment", (req, res) => {

    const { customer_id, amount } = req.body;

    if (!customer_id || !amount) {
        return res.send("Customer ID and amount are required");
    }

    const payment_date = new Date();

    const SQL_Query = `
        INSERT INTO payments (customer_id, amount, payment_date)
        VALUES (?, ?, ?)
    `;

    db.query(SQL_Query, [customer_id, amount, payment_date], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Payment Failed");
        }

        res.send("Payment Added Successfully");
    });
});


// =====================================
// SERVER START
// =====================================

// =====================================
// SERVER START
// =====================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("👤 Agent login  : agent@gmail.com / 123");
});