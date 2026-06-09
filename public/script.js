// ======================================
// SET WELCOME TEXT
// ======================================

window.onload = function () {
    const name = sessionStorage.getItem("customer_name");
    const el = document.getElementById("welcomeText");
    if (name && el) {
        el.textContent = "Welcome, " + name + "  ";
    }
};


// ======================================
// REGISTER USER
// ======================================

async function registerUser() {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    if (password.length < 4) {
        alert("Password must be at least 4 characters");
        return;
    }

    const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const msg = await res.text();

    alert(msg);

    if (msg === "Success") {
        window.location.href = "/login";
    }
}


// ======================================
// LOGIN USER
// ======================================

async function loginUser() {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        alert("Please enter your email and password");
        return;
    }

    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const msg = await res.text();

    if (msg === "admin Success") {

        sessionStorage.setItem("role", "agent");
        window.location.href = "/agent";

    } else {

        try {
            const data = JSON.parse(msg);

            if (data.message === "Success") {

                sessionStorage.setItem("role", "customer");
                sessionStorage.setItem("customer_id", data.user.id);
                sessionStorage.setItem("customer_name", data.user.name);
                window.location.href = "/dashboard";
            }

        } catch (e) {
            alert(msg);
        }
    }
}


// ======================================
// LOGOUT
// ======================================

function logout() {
    sessionStorage.clear();
    window.location.href = "/login";
}


// ======================================
// ADD POLICY (AGENT)
// ======================================

async function addPolicy() {

    const policy_name = document.getElementById("policy_name").value.trim();
    const policy_amount = document.getElementById("policy_amount").value.trim();
    const policy_duration = document.getElementById("policy_duration").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!policy_name || !policy_amount || !policy_duration || !description) {
        alert("Please fill all policy fields");
        return;
    }

    const res = await fetch("/add-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policy_name, policy_amount, policy_duration, description })
    });

    const msg = await res.text();
    alert(msg);

    document.getElementById("policy_name").value = "";
    document.getElementById("policy_amount").value = "";
    document.getElementById("policy_duration").value = "";
    document.getElementById("description").value = "";
}


// ======================================
// UPDATE CLAIM (AGENT)
// ======================================

async function updateClaim() {

    const claim_id = document.getElementById("update_claim_id").value.trim();
    const claim_status = document.getElementById("claim_status").value;

    if (!claim_id) {
        alert("Please enter a Claim ID");
        return;
    }

    const res = await fetch("/update-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim_id, claim_status })
    });

    const msg = await res.text();
    alert(msg);

    document.getElementById("update_claim_id").value = "";
}


// ======================================
// ADD PAYMENT (AGENT)
// ======================================

async function addPayment() {

    const customer_id = document.getElementById("customer_id").value.trim();
    const amount = document.getElementById("payment_amount").value.trim();

    if (!customer_id || !amount) {
        alert("Please enter Customer ID and Amount");
        return;
    }

    const res = await fetch("/add-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id, amount })
    });

    const msg = await res.text();
    alert(msg);

    document.getElementById("customer_id").value = "";
    document.getElementById("payment_amount").value = "";
}


// ======================================
// UPDATE APPLICATION (AGENT)
// ======================================

async function updateApplication() {

    const application_id = document.getElementById("application_id").value.trim();
    const status = document.getElementById("application_status").value;

    if (!application_id) {
        alert("Please enter an Application ID");
        return;
    }

    const res = await fetch("/update-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id, status })
    });

    const msg = await res.text();
    alert(msg);

    document.getElementById("application_id").value = "";
}


// ======================================
// VIEW POLICIES (CUSTOMER - BROWSE)
// ======================================

async function viewPolicies() {

    const res = await fetch("/view-policies");
    const data = await res.json();

    let output = "";

    data.forEach((policy) => {
        output += `
            <div class="policy-box">
                <h3>${policy.policy_name}</h3>
                <p>💰 Amount: ₹${policy.policy_amount}</p>
                <p>⏳ Duration: ${policy.policy_duration}</p>
                <p>${policy.description}</p>
                <p class="policy-id-hint">Policy ID: <strong>${policy.id}</strong></p>
            </div>
        `;
    });

    document.getElementById("policyList").innerHTML =
        output || "<p style='color:rgba(255,255,255,0.6)'>No policies available.</p>";
}


// ======================================
// APPLY POLICY (CUSTOMER)
// ======================================

async function applyPolicy() {

    const policy_id = document.getElementById("policy_id").value.trim();
    const customer_id = sessionStorage.getItem("customer_id");

    if (!policy_id) {
        alert("Please enter a Policy ID");
        return;
    }

    if (!customer_id) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
        return;
    }

    const res = await fetch("/apply-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id, policy_id })
    });

    const msg = await res.text();
    alert(msg);

    document.getElementById("policy_id").value = "";
}


// ======================================
// SUBMIT CLAIM (CUSTOMER)
// ======================================

async function submitClaim() {

    const policy_id = document.getElementById("claim_policy_id").value.trim();
    const claim_reason = document.getElementById("claim_reason").value.trim();
    const customer_id = sessionStorage.getItem("customer_id");
    const el = document.getElementById("submitClaimResult");

    if (!policy_id || !claim_reason) {
        el.innerHTML = `<div class="error-msg">❌ Please fill in both Policy ID and claim reason.</div>`;
        return;
    }

    if (!customer_id) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
        return;
    }

    const res = await fetch("/submit-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id, policy_id, claim_reason })
    });

    const data = await res.json();

    if (data.claim_id) {
        el.innerHTML = `
            <div class="success-msg">
                ✅ ${data.message}<br>
                <strong>Your Claim ID: ${data.claim_id}</strong><br>
                <small>Save this ID to track your claim.</small>
            </div>
        `;
        document.getElementById("claim_policy_id").value = "";
        document.getElementById("claim_reason").value = "";
    } else {
        el.innerHTML = `<div class="error-msg">❌ ${data.message || "Claim failed. Check the Policy ID and try again."}</div>`;
    }
}


// ======================================
// CHECK CLAIM STATUS (CUSTOMER)
// ======================================

async function checkClaimStatus() {

    const claim_id = document.getElementById("claim_id").value.trim();

    if (!claim_id) {
        alert("Please enter a Claim ID");
        return;
    }

    const res = await fetch(`/claim-status/${claim_id}`);
    const data = await res.json();
    const el = document.getElementById("claimResult");

    if (data.length > 0) {

        const statusColor = {
            "Approved": "#4ade80",
            "Rejected": "#f87171",
            "Pending": "#facc15"
        };

        const color = statusColor[data[0].claim_status] || "#facc15";

        el.innerHTML = `
            Claim <strong>#${data[0].id}</strong> — 
            <span style="color:${color}">${data[0].claim_status}</span>
        `;

    } else {
        el.innerHTML = "❌ Claim Not Found";
    }
}


// ======================================
// LOAD MY CLAIMS (CUSTOMER)
// ======================================

async function loadMyClaims() {

    const customer_id = sessionStorage.getItem("customer_id");

    if (!customer_id) return;

    const res = await fetch(`/my-claims/${customer_id}`);
    const data = await res.json();
    const el = document.getElementById("myClaimsList");

    if (data.length === 0) {
        el.innerHTML = "<p style='color:rgba(255,255,255,0.6);padding:10px'>No claims found.</p>";
        return;
    }

    let table = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Claim ID</th>
                    <th>Policy</th>
                    <th>Reason</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(c => {

        const statusClass = c.claim_status === "Approved" ? "status-approved"
            : c.claim_status === "Rejected" ? "status-rejected"
            : "status-pending";

        table += `
            <tr>
                <td>#${c.id}</td>
                <td>${c.policy_name || "N/A"}</td>
                <td>${c.claim_reason || "—"}</td>
                <td><span class="status-badge ${statusClass}">${c.claim_status}</span></td>
            </tr>
        `;
    });

    table += `</tbody></table>`;
    el.innerHTML = table;
}


// ======================================
// LOAD MY APPLICATIONS (CUSTOMER)
// ======================================

async function loadMyApplications() {

    const customer_id = sessionStorage.getItem("customer_id");

    if (!customer_id) return;

    const res = await fetch(`/my-applications/${customer_id}`);
    const data = await res.json();
    const el = document.getElementById("myApplicationsList");

    if (data.length === 0) {
        el.innerHTML = "<p style='color:rgba(255,255,255,0.6);padding:10px'>No applications found.</p>";
        return;
    }

    let table = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>App ID</th>
                    <th>Policy</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(a => {

        const statusClass = a.status === "Approved" ? "status-approved"
            : a.status === "Rejected" ? "status-rejected"
            : "status-pending";

        table += `
            <tr>
                <td>#${a.id}</td>
                <td>${a.policy_name || "N/A"}</td>
                <td><span class="status-badge ${statusClass}">${a.status}</span></td>
            </tr>
        `;
    });

    table += `</tbody></table>`;
    el.innerHTML = table;
}


// ======================================
// LOAD ALL CLAIMS (AGENT)
// ======================================

async function loadAllClaims() {

    const res = await fetch("/view-claims");
    const data = await res.json();
    const el = document.getElementById("allClaimsList");

    if (data.length === 0) {
        el.innerHTML = "<p style='color:rgba(255,255,255,0.6);padding:10px'>No claims found.</p>";
        return;
    }

    let table = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Policy</th>
                    <th>Reason</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(c => {

        const statusClass = c.claim_status === "Approved" ? "status-approved"
            : c.claim_status === "Rejected" ? "status-rejected"
            : "status-pending";

        table += `
            <tr>
                <td>#${c.id}</td>
                <td>${c.customer_name || "—"}</td>
                <td>${c.policy_name || "—"}</td>
                <td>${c.claim_reason || "—"}</td>
                <td><span class="status-badge ${statusClass}">${c.claim_status}</span></td>
            </tr>
        `;
    });

    table += `</tbody></table>`;
    el.innerHTML = table;
}


// ======================================
// LOAD ALL APPLICATIONS (AGENT)
// ======================================

async function loadAllApplications() {

    const res = await fetch("/view-applications");
    const data = await res.json();
    const el = document.getElementById("allApplicationsList");

    if (data.length === 0) {
        el.innerHTML = "<p style='color:rgba(255,255,255,0.6);padding:10px'>No applications found.</p>";
        return;
    }

    let table = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Policy</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(a => {

        const statusClass = a.status === "Approved" ? "status-approved"
            : a.status === "Rejected" ? "status-rejected"
            : "status-pending";

        table += `
            <tr>
                <td>#${a.id}</td>
                <td>${a.customer_name || "—"}</td>
                <td>${a.policy_name || "—"}</td>
                <td><span class="status-badge ${statusClass}">${a.status}</span></td>
                <td>
                    <select class="inline-select" id="appStatus_${a.id}">
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <button class="inline-btn" onclick="quickUpdateApplication(${a.id})">Update</button>
                </td>
            </tr>
        `;
    });

    table += `</tbody></table>`;
    el.innerHTML = table;
}


// ======================================
// QUICK UPDATE APPLICATION (AGENT)
// ======================================

async function quickUpdateApplication(application_id) {

    const status = document.getElementById(`appStatus_${application_id}`).value;

    const res = await fetch("/update-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id, status })
    });

    const msg = await res.text();
    alert(msg);

    loadAllApplications();
}


// ======================================
// LOAD POLICIES (AGENT)
// ======================================

async function loadAgentPolicies() {

    const res = await fetch("/view-policies");
    const data = await res.json();
    const el = document.getElementById("agentPolicyList");

    if (data.length === 0) {
        el.innerHTML = "<p style='color:rgba(255,255,255,0.6);padding:10px'>No policies found.</p>";
        return;
    }

    let table = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Policy Name</th>
                    <th>Amount</th>
                    <th>Duration</th>
                    <th>Description</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(p => {
        table += `
            <tr>
                <td>#${p.id}</td>
                <td>${p.policy_name}</td>
                <td>₹${p.policy_amount}</td>
                <td>${p.policy_duration}</td>
                <td>${p.description}</td>
                <td>
                    <button class="delete-btn" onclick="deletePolicy(${p.id})">
                        🗑️ Delete
                    </button>
                </td>
            </tr>
        `;
    });

    table += `</tbody></table>`;
    el.innerHTML = table;
}


// ======================================
// DELETE POLICY (AGENT)
// ======================================

async function deletePolicy(policy_id) {

    if (!confirm("Are you sure you want to delete this policy?")) return;

    const res = await fetch("/delete-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policy_id })
    });

    const msg = await res.text();
    alert(msg);

    loadAgentPolicies();
}
