-- =============================================
-- SETUP SCRIPT: Create Default Admin User
-- =============================================
-- Run this after deploying the schema
-- Default credentials:
-- Email: admin@triumphantbookclub.com
-- Password: admin123
-- =============================================

-- First, enable the pgcrypto extension for hashing (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert default admin user
-- Password is hashed with bcrypt (cost factor 10)
INSERT INTO public.admin_users (email, password, name, role, is_active)
VALUES (
  'admin@triumphantbookclub.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
  'Administrator',
  'admin',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Verify the admin was created
SELECT id, email, name, role, is_active, created_at 
FROM public.admin_users 
WHERE email = 'admin@triumphantbookclub.com';
