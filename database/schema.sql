-- ============================================================
-- COVID-19 Information and Awareness Portal
-- Database Schema: PostgreSQL (Supabase Compatible)
-- STQA Mini Project
-- ============================================================

-- Drop tables if already existing (clean migration support)
DROP TABLE IF EXISTS test_runs CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Comments Table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Feedback Table
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    rating INT DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Test Runs Table (STQA Automated Test Execution Logs)
CREATE TABLE test_runs (
    id SERIAL PRIMARY KEY,
    test_id VARCHAR(50) NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    input_data TEXT,
    expected_output TEXT,
    actual_output TEXT,
    status VARCHAR(20) NOT NULL,
    execution_time_ms NUMERIC(10, 2) DEFAULT 0.00,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & quick queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_feedback_created ON feedback(created_at DESC);
CREATE INDEX idx_test_runs_status ON test_runs(status);

-- Seed Data: Default Administrator and sample test accounts
-- Admin Password: Admin@12345 (BCRYPT hash)
INSERT INTO users (name, email, mobile, password_hash, role) VALUES 
('System Administrator', 'admin@covidportal.org', '9876543210', '$2y$10$wN1y70U339O57i5TjZ9J0.a4FjQ3G7vS/nE8bC6iZ5eK4vR7bK0gK', 'admin'),
('Omkar Ahirrao', 'omkar@gmail.com', '9890123456', '$2y$10$wN1y70U339O57i5TjZ9J0.a4FjQ3G7vS/nE8bC6iZ5eK4vR7bK0gK', 'user'),
('Priya Sharma', 'priya.sharma@outlook.com', '9123456789', '$2y$10$wN1y70U339O57i5TjZ9J0.a4FjQ3G7vS/nE8bC6iZ5eK4vR7bK0gK', 'user');

-- Seed Data: Sample Initial Community Comments
INSERT INTO comments (user_id, comment_text) VALUES 
(2, 'Remember to wear your N95 or double-cloth masks in crowded public indoor areas. Stay safe everyone!'),
(3, 'Completed my booster vaccination dose today at the local health center. Smooth process and no side effects.');

-- Seed Data: Sample Initial Feedback
INSERT INTO feedback (user_id, name, email, message, rating) VALUES 
(2, 'Omkar Ahirrao', 'omkar@gmail.com', 'The symptoms checker and WHO guidelines section are very helpful and well-organized.', 5);
