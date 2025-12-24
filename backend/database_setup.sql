-- COLLAGE Database Setup for Supabase
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'vendor', 'admin')),
    university VARCHAR(255),
    company_name VARCHAR(255),
    company_registration VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verification_method VARCHAR(50) DEFAULT 'email' CHECK (verification_method IN ('email', 'student-id', 'sheerid')),
    verification_code VARCHAR(10),
    verification_code_expires TIMESTAMP WITH TIME ZONE,
    student_id_url TEXT,
    sheer_id_verification_id VARCHAR(255),
    verification_token VARCHAR(255),
    verification_token_expires TIMESTAMP WITH TIME ZONE,
    profile_picture TEXT,
    phone_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create discounts table
CREATE TABLE IF NOT EXISTS discounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand VARCHAR(255) NOT NULL,
    discount TEXT NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'other' CHECK (category IN ('electronics', 'fashion', 'food', 'entertainment', 'education', 'health', 'travel', 'other')),
    code VARCHAR(50) UNIQUE,
    terms_and_conditions TEXT NOT NULL,
    expiry_days INTEGER DEFAULT 30,
    expiry_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    is_expired BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create discount_usage table to track which students used which discounts
CREATE TABLE IF NOT EXISTS discount_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    discount_id UUID NOT NULL REFERENCES discounts(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(discount_id, student_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(verification_status);
CREATE INDEX IF NOT EXISTS idx_discounts_vendor_id ON discounts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_discounts_category ON discounts(category);
CREATE INDEX IF NOT EXISTS idx_discounts_is_active ON discounts(is_active);
CREATE INDEX IF NOT EXISTS idx_discounts_expiry_date ON discounts(expiry_date);
CREATE INDEX IF NOT EXISTS idx_discount_usage_discount_id ON discount_usage(discount_id);
CREATE INDEX IF NOT EXISTS idx_discount_usage_student_id ON discount_usage(student_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discounts_updated_at BEFORE UPDATE ON discounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user
-- Password is 'admin123' (hashed with bcrypt)
-- In production, change this password immediately after first login
INSERT INTO users (email, password, name, role, is_verified, verification_status)
VALUES (
    'admin@collage.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'admin123'
    'System Administrator',
    'admin',
    true,
    'verified'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample data (optional - remove in production)
-- Sample vendor
INSERT INTO users (email, password, name, role, company_name, is_verified, verification_status)
VALUES (
    'vendor@collage.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'admin123'
    'Sample Vendor',
    'vendor',
    'Sample Company Inc.',
    true,
    'verified'
) ON CONFLICT (email) DO NOTHING;

-- Sample student
INSERT INTO users (email, password, name, role, university, is_verified, verification_status)
VALUES (
    'student@collage.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'admin123'
    'Sample Student',
    'student',
    'Sample University',
    true,
    'verified'
) ON CONFLICT (email) DO NOTHING;

-- Sample discount
INSERT INTO discounts (vendor_id, brand, discount, description, category, code, terms_and_conditions, expiry_days)
SELECT
    u.id,
    'Sample Brand',
    '20% OFF',
    'Get 20% off on all items',
    'fashion',
    'SAMPLE20',
    'Valid for online purchases only. Cannot be combined with other offers.',
    30
FROM users u
WHERE u.email = 'vendor@collage.com'
ON CONFLICT (code) DO NOTHING;

-- Enable Row Level Security (RLS) for better security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (optional - customize based on your needs)
-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Vendors can view their own discounts
CREATE POLICY "Vendors can view own discounts" ON discounts
    FOR SELECT USING (auth.uid() = vendor_id);

-- Students can view active discounts
CREATE POLICY "Students can view active discounts" ON discounts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'student'
        ) AND is_active = true AND is_expired = false
    );

-- Vendors can create discounts
CREATE POLICY "Vendors can create discounts" ON discounts
    FOR INSERT WITH CHECK (auth.uid() = vendor_id);

-- Vendors can update their own discounts
CREATE POLICY "Vendors can update own discounts" ON discounts
    FOR UPDATE USING (auth.uid() = vendor_id);

-- Students can create discount usage records
CREATE POLICY "Students can create discount usage" ON discount_usage
    FOR INSERT WITH CHECK (
        auth.uid() = student_id AND
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'student'
        )
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON users TO anon, authenticated;
GRANT ALL ON discounts TO anon, authenticated;
GRANT ALL ON discount_usage TO anon, authenticated;

-- Note: In production, you should use Supabase Auth instead of storing passwords directly
-- This setup uses direct password storage for simplicity in the migration
-- Consider migrating to Supabase Auth for better security
