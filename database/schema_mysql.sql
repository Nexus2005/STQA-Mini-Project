-- ============================================================
-- COVID-19 Information and Awareness Portal
-- Database Schema: MySQL / MariaDB (XAMPP phpMyAdmin Compatible)
-- STQA Mini Project
-- ============================================================

CREATE DATABASE IF NOT EXISTS `covid_portal` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `covid_portal`;

-- Drop existing tables
DROP TABLE IF EXISTS `test_runs`;
DROP TABLE IF EXISTS `feedback`;
DROP TABLE IF EXISTS `comments`;
DROP TABLE IF EXISTS `users`;

-- 1. Users Table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `mobile` VARCHAR(20) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Comments Table
CREATE TABLE `comments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `comment_text` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Feedback Table
CREATE TABLE `feedback` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `rating` INT DEFAULT 5,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Test Runs Table
CREATE TABLE `test_runs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `test_id` VARCHAR(50) NOT NULL,
  `test_name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `input_data` TEXT,
  `expected_output` TEXT,
  `actual_output` TEXT,
  `status` VARCHAR(20) NOT NULL,
  `execution_time_ms` DECIMAL(10, 2) DEFAULT 0.00,
  `executed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data (Password: Admin@12345)
INSERT INTO `users` (`id`, `name`, `email`, `mobile`, `password_hash`, `role`) VALUES 
(1, 'System Administrator', 'admin@covidportal.org', '9876543210', '$2y$10$wN1y70U339O57i5TjZ9J0.a4FjQ3G7vS/nE8bC6iZ5eK4vR7bK0gK', 'admin'),
(2, 'Omkar Ahirrao', 'omkar@gmail.com', '9890123456', '$2y$10$wN1y70U339O57i5TjZ9J0.a4FjQ3G7vS/nE8bC6iZ5eK4vR7bK0gK', 'user'),
(3, 'Priya Sharma', 'priya.sharma@outlook.com', '9123456789', '$2y$10$wN1y70U339O57i5TjZ9J0.a4FjQ3G7vS/nE8bC6iZ5eK4vR7bK0gK', 'user');

INSERT INTO `comments` (`id`, `user_id`, `comment_text`) VALUES 
(1, 2, 'Remember to wear your N95 or double-cloth masks in crowded public indoor areas. Stay safe everyone!'),
(2, 3, 'Completed my booster vaccination dose today at the local health center. Smooth process and no side effects.');

INSERT INTO `feedback` (`id`, `user_id`, `name`, `email`, `message`, `rating`) VALUES 
(1, 2, 'Omkar Ahirrao', 'omkar@gmail.com', 'The symptoms checker and WHO guidelines section are very helpful and well-organized.', 5);
