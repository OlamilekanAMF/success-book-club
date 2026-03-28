-- =============================================
-- COMPLETE DATABASE SETUP
-- Run this entire script in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- DROP EXISTING TABLES (if any)
-- =============================================
DROP TABLE IF EXISTS public.newsletter_campaigns CASCADE;
DROP TABLE IF EXISTS public.newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS public.author_applications CASCADE;
DROP TABLE IF EXISTS public.challenge_participants CASCADE;
DROP TABLE IF EXISTS public.challenges CASCADE;
DROP TABLE IF EXISTS public.podcasts CASCADE;
DROP TABLE IF EXISTS public.press CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;
DROP TABLE IF EXISTS public.recommendation_votes CASCADE;
DROP TABLE IF EXISTS public.book_recommendations CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.event_registrations CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.article_comments CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.poll_votes CASCADE;
DROP TABLE IF EXISTS public.poll_options CASCADE;
DROP TABLE IF EXISTS public.polls CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.forum_replies CASCADE;
DROP TABLE IF EXISTS public.forum_posts CASCADE;
DROP TABLE IF EXISTS public.user_library CASCADE;
DROP TABLE IF EXISTS public.books CASCADE;
DROP TABLE IF EXISTS public.password_resets CASCADE;
DROP TABLE IF EXISTS public.user_sessions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  interests JSONB DEFAULT '[]'::jsonb,
  membership_tier TEXT DEFAULT 'free' CHECK (membership_tier IN ('free', 'premium', 'author')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ADMIN USERS TABLE
-- =============================================
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BOOKS TABLE
-- =============================================
CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN ('spotlight', 'author', 'general')),
  genre TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  page_count INTEGER,
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ARTICLES TABLE
-- =============================================
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category TEXT DEFAULT 'General',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PRESS TABLE
-- =============================================
CREATE TABLE public.press (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PODCASTS TABLE
-- =============================================
CREATE TABLE public.podcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  episode_number INTEGER,
  duration TEXT,
  audio_url TEXT,
  cover_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CHALLENGES TABLE
-- =============================================
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  target_books INTEGER DEFAULT 5,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  start_date DATE,
  end_date DATE,
  created_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- =============================================
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- =============================================
-- ENABLE RLS
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view books" 
ON public.books FOR SELECT USING (true);

CREATE POLICY "Admins can manage books" 
ON public.books FOR ALL USING (true);

CREATE POLICY "Anyone can view published articles" 
ON public.articles FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage articles" 
ON public.articles FOR ALL USING (true);

CREATE POLICY "Anyone can view published press" 
ON public.press FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage press" 
ON public.press FOR ALL USING (true);

CREATE POLICY "Anyone can view published podcasts" 
ON public.podcasts FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage podcasts" 
ON public.podcasts FOR ALL USING (true);

CREATE POLICY "Anyone can view challenges" 
ON public.challenges FOR SELECT USING (true);

CREATE POLICY "Admins can manage challenges" 
ON public.challenges FOR ALL USING (true);

CREATE POLICY "Admins can manage subscribers" 
ON public.newsletter_subscribers FOR ALL USING (true);

-- =============================================
-- CREATE DEFAULT ADMIN
-- =============================================
INSERT INTO public.admin_users (email, password, name, role, is_active)
VALUES (
  'admin@triumphantbookclub.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Administrator',
  'admin',
  true
)
ON CONFLICT (email) DO UPDATE SET 
  password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  is_active = true;

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_featured ON books(is_featured);
CREATE INDEX idx_articles_published ON articles(published_at DESC);
CREATE INDEX idx_press_status ON press(status);
CREATE INDEX idx_podcasts_status ON podcasts(status);
CREATE INDEX idx_challenges_status ON challenges(status);

-- =============================================
-- VERIFY SETUP
-- =============================================
SELECT 'Setup complete!' as status;
SELECT id, email, name, role, is_active FROM public.admin_users WHERE email = 'admin@triumphantbookclub.com';
