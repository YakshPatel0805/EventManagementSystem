# Quick Start Guide

## Setup (First Time)

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Events
```bash
npm run seed
```

### 3. Start Application
```bash
npm run dev
```

### 4. Open Browser
Visit: `http://localhost:3000`

## Create Your First Admin Account

1. Click "Sign Up" on landing page
2. Fill in the form:
   - Name: `Admin User`
   - Email: `admin@devevent.com` (or any email in ADMIN_EMAILS list)
   - Password: `your-secure-password`
   - Confirm Password: `your-secure-password`
3. Click "Sign Up"
4. You'll be automatically redirected to Admin Dashboard!

## Create a Regular User Account

1. Click "Sign Up" on landing page
2. Fill in the form:
   - Name: `Test User`
   - Email: `user@example.com` (any email NOT in admin list)
   - Password: `your-password`
   - Confirm Password: `your-password`
3. Click "Sign Up"
4. You'll be redirected to Events Home page!

## Adding More Admin Emails

Edit `lib/config.ts`:

```typescript
export const ADMIN_EMAILS = [
  'admin@devevent.com',
  'youremail@company.com',  // Add your email here
];
```

## Features

### For Users:
- Browse events
- Book events
- View bookings
- Search bookings by email

### For Admins:
- View dashboard with statistics
- Create new events
- Delete events
- View all bookings

## Important Notes

- **No hardcoded passwords** - All users created through signup
- **Automatic role assignment** - Based on email address
- **Database-driven** - All data stored in MongoDB
- **Role-based access** - Admins and users see different interfaces

## Troubleshooting

### Can't access admin features?
- Make sure your email is in the `ADMIN_EMAILS` list in `lib/config.ts`
- Sign up with that email
- You'll automatically get admin access

### Forgot to seed events?
```bash
npm run seed
```

### Need to reset everything?
1. Stop the server
2. Delete the database (or run seed again)
3. Restart: `npm run dev`
4. Sign up again

## Default Admin Email

By default, these emails have admin access:
- `admin@devevent.com`
- `admin@example.com`

You can sign up with either of these to get admin access immediately!

---

**That's it! You're ready to use DevEvent! 🚀**
