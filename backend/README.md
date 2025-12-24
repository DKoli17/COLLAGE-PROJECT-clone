# COLLAGE Backend - Supabase Setup

This backend has been migrated from MongoDB to Supabase (PostgreSQL).

## Prerequisites

- Node.js installed
- Supabase account

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be fully initialized

### 2. Database Setup

1. In your Supabase dashboard, go to the "SQL Editor" section
2. Copy and paste the contents of `database_setup.sql` and run it
3. This will create all necessary tables, indexes, and insert a default admin user

### 3. Environment Variables

Create a `.env` file in the backend directory with:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secure_jwt_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

You can find your Supabase URL and anon key in:
- Project Settings → API → Project URL
- Project Settings → API → Project API keys → anon public

### 4. Install Dependencies

```bash
npm install
```

### 5. Start the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

## Database Schema

### Users Table
- Stores user information, authentication, and verification data

### Discounts Table
- Stores discount/coupon information from vendors

### Discount Usage Table
- Tracks which students have used which discounts

## API Endpoints

The API endpoints remain the same, but now use Supabase instead of MongoDB.

## Default Admin Account

- Email: `admin@collage.com`
- Password: `admin123`

**⚠️ Important:** Change this password after first login!

## Migration Notes

- All Mongoose models have been converted to Supabase client methods
- ObjectIds are now UUIDs
- Field names use snake_case to match PostgreSQL conventions
- Relationships are maintained using foreign keys
