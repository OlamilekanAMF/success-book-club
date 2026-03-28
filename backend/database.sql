-- Database Schema for Triumphant Book Club
-- Run this in phpMyAdmin to create all necessary tables

-- ================================
-- USERS TABLE
-- ================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    interests TEXT,
    membership_tier ENUM('free', 'premium') DEFAULT 'free',
    stripe_customer_id VARCHAR(255),
    google_id VARCHAR(255),
    facebook_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_google_id (google_id),
    INDEX idx_facebook_id (facebook_id)
);

-- ================================
-- USER SESSIONS TABLE
-- ================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires (expires_at)
);

-- ================================
-- PASSWORD RESETS TABLE
-- ================================
CREATE TABLE IF NOT EXISTS password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token)
);

-- ================================
-- BOOKS TABLE (for library)
-- ================================
CREATE TABLE IF NOT EXISTS books (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    category VARCHAR(100),
    description TEXT,
    cover_url TEXT,
    pages INT,
    audio_duration VARCHAR(50),
    rating DECIMAL(3,2),
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample books
INSERT INTO books (id, title, author, category, description, cover_url, pages, rating, review_count) VALUES
('rising-from-ashes', 'Rising from Ashes', 'Michael Torres', 'fiction', 'A powerful story of transformation and resilience.', 'https://picsum.photos/seed/book1/300/450', 342, 4.2, 1247),
('against-all-odds', 'Against All Odds', 'Jennifer Liu', 'biography', 'Breaking barriers against insurmountable odds.', 'https://picsum.photos/seed/book2/300/450', 428, 4.8, 2341),
('the-power-within', 'The Power Within', 'Dr. Robert Chen', 'self-help', 'The science behind resilience and transformation.', 'https://picsum.photos/seed/book3/300/450', 367, 4.1, 987),
('unbroken-legacy', 'Unbroken Legacy', 'Maria Rodriguez', 'historical', 'Three generations fighting for justice.', 'https://picsum.photos/seed/book4/300/450', 512, 4.6, 1892),
('journey-home', 'Journey Home', 'David Thompson', 'memoir', 'Finding your way back to yourself.', 'https://picsum.photos/seed/book5/300/450', 389, 4.3, 756);

-- ================================
-- USER LIBRARY TABLE
-- ================================
CREATE TABLE IF NOT EXISTS user_library (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id VARCHAR(100) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_book (user_id, book_id),
    INDEX idx_user_id (user_id)
);

-- ================================
-- FORUM POSTS TABLE
-- ================================
CREATE TABLE IF NOT EXISTS forum_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
);

-- Insert sample forum posts
INSERT INTO forum_posts (user_id, title, content, category) VALUES
(1, 'The ending of "The Unbreakable Spirit" brought me to tears', 'I just finished reading this month''s pick and I''m completely overwhelmed. The way Sarah writes about overcoming adversity through faith and community...', 'monthly-picks'),
(1, 'Completed my first reading challenge!', 'I just finished reading 12 books this month! The "Triumphant Stories" challenge really pushed me to explore outside my comfort zone.', 'reading-challenges'),
(1, 'Character analysis: Discussing resilience in "Against All Odds"', 'I''m fascinated by how Jennifer Liu crafted such complex characters who face overwhelming odds yet find strength in community.', 'author-spotlights');

-- ================================
-- FORUM REPLIES TABLE
-- ================================
CREATE TABLE IF NOT EXISTS forum_replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id)
);

-- ================================
-- POLLS TABLE
-- ================================
CREATE TABLE IF NOT EXISTS polls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    category VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_active (active)
);

-- Insert sample polls
INSERT INTO polls (question, category, active) VALUES
('Which genre should we feature next month?', 'genre', TRUE),
('What''s your favorite reading time?', 'preferences', TRUE),
('How many books do you read per month?', 'reading-habits', TRUE);

-- ================================
-- POLL OPTIONS TABLE
-- ================================
CREATE TABLE IF NOT EXISTS poll_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    votes INT DEFAULT 0,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
    INDEX idx_poll_id (poll_id)
);

-- Insert poll options
INSERT INTO poll_options (poll_id, option_text, votes) VALUES
(1, 'Historical Fiction', 45),
(1, 'Memoir & Biography', 38),
(1, 'Science Fiction', 17),
(2, 'Evening (6PM - 10PM)', 52),
(2, 'Morning (5AM - 9AM)', 31),
(2, 'Weekend Afternoons', 17),
(3, '2-3 books', 34),
(3, '1-2 books', 28),
(3, '4+ books', 22),
(3, 'Less than 1', 16);

-- ================================
-- POLL VOTES TABLE
-- ================================
CREATE TABLE IF NOT EXISTS poll_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT NOT NULL,
    user_id INT,
    option_id INT NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES poll_options(id) ON DELETE CASCADE,
    UNIQUE KEY unique_poll_user (poll_id, user_id),
    INDEX idx_poll_id (poll_id)
);

-- ================================
-- CHAT MESSAGES TABLE
-- ================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id VARCHAR(100) NOT NULL,
    user_id INT,
    username VARCHAR(100),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_room_id (room_id),
    INDEX idx_created_at (created_at)
);

-- Insert sample chat messages
INSERT INTO chat_messages (room_id, username, message) VALUES
('general', 'Sarah M.', 'Just finished "The Unbreakable Spirit" - what a read!'),
('general', 'David K.', 'I''m halfway through - can''t put it down!'),
('monthly-pick', 'Jennifer L.', 'Anyone ready for our discussion tomorrow?'),
('new-releases', 'Michael T.', 'Check out the new triumph books dropping this week!');

-- ================================
-- BOOK RECOMMENDATIONS TABLE
-- ================================
CREATE TABLE IF NOT EXISTS book_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    description TEXT,
    votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_votes (votes)
);

-- Insert sample recommendations
INSERT INTO book_recommendations (user_id, title, author, description, votes) VALUES
(1, 'The Midnight Library', 'Matt Haig', 'A beautiful story about choices and parallel lives.', 89),
(1, 'Atomic Habits', 'James Clear', 'Life-changing book about building good habits.', 76),
(1, 'Project Hail Mary', 'Andy Weir', 'Incredible sci-fi about survival and friendship.', 65),
(1, 'The Four Agreements', 'Don Miguel Ruiz', 'Ancient wisdom for modern life.', 54);

-- ================================
-- RECOMMENDATION VOTES TABLE
-- ================================
CREATE TABLE IF NOT EXISTS recommendation_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recommendation_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recommendation_id) REFERENCES book_recommendations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_rec_user (recommendation_id, user_id)
);

-- ================================
-- CHALLENGES TABLE
-- ================================
CREATE TABLE IF NOT EXISTS challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target INT DEFAULT 1,
    type ENUM('monthly', 'weekly', 'yearly') DEFAULT 'monthly',
    start_date DATE,
    end_date DATE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample challenges
INSERT INTO challenges (title, description, target, type, start_date, end_date, active) VALUES
('February Challenge', 'Read 5 books featuring strong female protagonists', 5, 'monthly', '2024-02-01', '2024-02-29', FALSE),
('March Challenge', 'Read books by diverse authors from around the world', 5, 'monthly', '2024-03-01', '2024-03-31', TRUE),
('April Challenge', 'Complete a memoir or biography about overcoming adversity', 3, 'monthly', '2024-04-01', '2024-04-30', TRUE);

-- ================================
-- USER CHALLENGE PROGRESS TABLE
-- ================================
CREATE TABLE IF NOT EXISTS challenge_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    challenge_id INT NOT NULL,
    book_id VARCHAR(100),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_challenge (user_id, challenge_id, book_id)
);

-- ================================
-- COMPLETE!
-- ================================
SELECT 'Database setup complete!' AS message;
