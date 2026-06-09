-- =============================================
-- INSURANCE POLICY MANAGEMENT SYSTEM
-- Run this file in MySQL / phpMyAdmin first
-- =============================================

-- Step 1: Create and select database
CREATE DATABASE IF NOT EXISTS insurance_db;
USE insurance_db;

-- =============================================
-- TABLE: users (customers)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE: policies
-- =============================================
CREATE TABLE IF NOT EXISTS policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    policy_name VARCHAR(150) NOT NULL,
    policy_amount DECIMAL(10,2) NOT NULL,
    policy_duration VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE: applications
-- =============================================
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    policy_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE: claims
-- =============================================
CREATE TABLE IF NOT EXISTS claims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    policy_id INT NOT NULL,
    claim_reason TEXT,
    claim_status VARCHAR(50) DEFAULT 'Pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE: payments
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATETIME NOT NULL
);

-- =============================================
-- SAMPLE DATA (optional - for testing)
-- =============================================

-- Sample customer
INSERT INTO users (name, email, password) VALUES
('John Doe', 'john@gmail.com', '1234'),
('Jane Smith', 'jane@gmail.com', '1234');

-- Sample policies
INSERT INTO policies (policy_name, policy_amount, policy_duration, description) VALUES
('Health Shield Plus', 5000.00, '1 Year', 'Comprehensive health insurance covering hospitalization and surgery'),
('Life Secure', 10000.00, '5 Years', 'Term life insurance with full family coverage'),
('Motor Guard', 3000.00, '1 Year', 'Full vehicle insurance with accident and theft coverage');

-- =============================================
-- DONE! Now run: npm install  then  node app.js
-- =============================================
