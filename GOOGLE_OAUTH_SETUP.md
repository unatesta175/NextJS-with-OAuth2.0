# Google OAuth Setup Guide

## 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 Client ID:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add authorized origins: `http://localhost:3000` (for development)
   - Copy the Client ID

## 2. Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 3. Backend Database Migration

You need to add new columns to your users table. Run this migration:

```sql
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN password_reset_token VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN password_reset_expires TIMESTAMP NULL;
```

Or create a Laravel migration:

```bash
cd backend
php artisan make:migration add_google_and_password_reset_fields_to_users_table
```

## 4. Test the Implementation

1. Start your backend server: `cd backend && php artisan serve`
2. Start your frontend server: `cd frontend && npm run dev`
3. Visit `http://localhost:3000/auth/login`
4. Try the "Continue with Google" button
5. Try the "Forgot your password?" link

## Features Implemented

✅ **Google OAuth Login**
- Sign in with Google account
- Automatic user creation for new Google users
- Integration with existing users

✅ **Password Reset Flow**
- Forgot password request
- Password reset with token validation
- Email notification (backend ready, email sending needs configuration)

✅ **Enhanced Authentication**
- React Hook Form + Zod validation
- Loading states with spinners
- Toast notifications for all operations
- Proper error handling

✅ **Security Features**
- HTTP-only cookies for authentication
- Token expiration handling
- Input validation on both frontend and backend

## Next Steps

1. Configure email sending in Laravel (for password reset emails)
2. Set up production Google OAuth credentials
3. Add email verification for new accounts
4. Implement 2FA (optional)
