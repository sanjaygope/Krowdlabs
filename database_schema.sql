-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Workers Table
CREATE TABLE workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone TEXT UNIQUE NOT NULL,
    full_name TEXT,
    city TEXT,
    language TEXT DEFAULT 'en',
    upi_id TEXT,
    tier INTEGER DEFAULT 1,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tasks Table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en TEXT NOT NULL,
    title_hi TEXT,
    description_en TEXT NOT NULL,
    description_hi TEXT,
    instructions TEXT NOT NULL,
    pay_amount INTEGER NOT NULL,
    example_video_url TEXT,
    status TEXT DEFAUlT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Clips Table
CREATE TABLE clips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    metadata JSONB DEFAULT '{}'::jsonb,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    clip_id UUID REFERENCES clips(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    upi_ref TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Optional: Enable Row Level Security (RLS) for workers table (Basic Example)
-- ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Workers can view own profile" ON workers FOR SELECT USING (auth.uid() = id);
-- CREATE POLICY "Workers can update own profile" ON workers FOR UPDATE USING (auth.uid() = id);
-- NOTE: In this MVP, if we are mapping Firebase Auth users to Supabase, we would sync the Firebase UID to the worker's `id` column.
