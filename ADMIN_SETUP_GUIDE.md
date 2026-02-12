# Admin Dashboard & Backend Setup Guide

## Overview
This guide will help you set up and run the complete admin dashboard and backend system.

## Prerequisites
- Node.js (v18+)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Project Structure
```
admin-backend/          # Express.js backend server (Port 3002)
admin-dashboard/        # Next.js frontend (Port 3000)
```

## Step 1: Setup Admin Backend

### 1.1 Install Dependencies
```bash
cd admin-backend
npm install
```

### 1.2 Configure Environment Variables
The `.env` file is already configured with:
- **PORT**: 3002
- **MONGODB_URI**: MongoDB connection string
- **JWT_SECRET**: JWT signing key
- **EMAIL_CONFIG**: Hostinger SMTP settings

Verify the `.env` file has correct values:
```
PORT=3002
NODE_ENV=development
MONGODB_URI=mongodb+srv://ahmad_db_user:tnfP2bu5bpgKUlLr@cluster0.bcfgtpa.mongodb.net/valygo-admin
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

### 1.3 Seed Admin User
Create the initial admin user in the database:
```bash
npm run seed:admin
```

This creates:
- **Email**: emailvalygolimited@gmail.com
- **Password**: cXmnZK65rf*&DaaD8wee
- **Role**: super_admin

### 1.4 Start Backend Server
```bash
npm run dev
```

You should see:
```
Admin backend server running on port 3002
Connected to MongoDB
```

## Step 2: Setup Admin Dashboard

### 2.1 Install Dependencies
```bash
cd admin-dashboard
npm install
```

### 2.2 Verify Environment Configuration
The `.env` file is already configured to connect to the backend:
```
NEXT_PUBLIC_API_URL=http://localhost:3002/api
NEXT_PUBLIC_APP_NAME=VALYGO Admin
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 2.3 Start Dashboard
```bash
npm run dev
```

The dashboard will be available at: `http://localhost:3000`

## Step 3: Login to Dashboard

1. Open `http://localhost:3000` in your browser
2. You'll be redirected to the login page
3. Enter credentials:
   - **Email**: emailvalygolimited@gmail.com
   - **Password**: cXmnZK65rf*&DaaD8wee
4. Click "Sign In"

## Available Dashboard Pages

After login, you can access:

### Main Dashboard
- **URL**: `/dashboard`
- **Features**: Overview stats, recent transactions, top users

### Users Management
- **URL**: `/dashboard/users-management`
- **Features**: User list, search, filtering, status management

### Subscriptions
- **URL**: `/dashboard/subscriptions`
- **Features**: Subscription tracking, MRR calculation, status updates

### KYC Verification
- **URL**: `/dashboard/kyc-verification`
- **Features**: KYC review, approve/reject workflow

### Transactions
- **URL**: `/dashboard/transactions`
- **Features**: Transaction monitoring, real-time data

### Overview
- **URL**: `/dashboard/overview`
- **Features**: Analytics and charts

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/profile` - Get current user profile

### Users
- `GET /api/users` - List all users (paginated)
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/:id` - Get user details
- `PATCH /api/users/:id` - Update user status
- `DELETE /api/users/:id` - Delete user

### Subscriptions
- `GET /api/subscriptions` - List subscriptions (paginated)
- `GET /api/subscriptions/stats` - Get subscription statistics
- `PUT /api/subscriptions/:id/status` - Update subscription status

### Transactions
- `GET /api/transactions` - List transactions (paginated)
- `GET /api/transactions/stats` - Get transaction statistics

### KYC
- `GET /api/kyc` - List KYC records
- `GET /api/kyc/:id` - Get KYC details
- `PATCH /api/kyc/:id/approve` - Approve KYC
- `PATCH /api/kyc/:id/reject` - Reject KYC

## Troubleshooting

### Connection Error on Login
**Error**: "Connection error. Please check if the backend is running on port 3002."

**Solution**:
1. Ensure backend is running: `npm run dev` in `admin-backend` folder
2. Check `.env` file has correct `NEXT_PUBLIC_API_URL=http://localhost:3002/api`
3. Verify MongoDB connection is working
4. Check firewall/network settings

### MongoDB Connection Failed
**Error**: "Failed to connect to MongoDB"

**Solution**:
1. Verify MongoDB URI in `.env` is correct
2. Check MongoDB cluster is accessible
3. Verify IP whitelist in MongoDB Atlas (if using cloud)
4. Test connection: `mongosh "mongodb+srv://..."`

### Port Already in Use
**Error**: "Port 3002 already in use"

**Solution**:
1. Kill process on port 3002: `lsof -ti:3002 | xargs kill -9`
2. Or change PORT in `.env` to a different port

### Admin User Not Found
**Error**: "Invalid credentials" on login

**Solution**:
1. Run seed script: `npm run seed:admin` in `admin-backend`
2. Verify MongoDB connection is working
3. Check admin user exists: `db.adminusers.findOne({email: "emailvalygolimited@gmail.com"})`

## Development Commands

### Admin Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run seed:admin   # Create admin user
npm run reset:admin  # Reset admin database
```

### Admin Dashboard
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

## Database Models

### AdminUser
- name: string
- email: string (unique)
- password: string (hashed)
- role: super_admin | admin | manager | support | analyst | sales_team
- status: active | inactive
- permissions: string[]
- lastLogin: Date

### User
- firstName, lastName, email
- phoneNumber, country
- status: active | inactive | suspended
- accountType: individual | business
- kycStatus, subscriptionStatus
- totalTransactions, totalVolume

### Subscription
- user_id: reference to User
- plan_display_name: string
- status: ACTIVE | PAST_DUE | SUSPENDED | CANCELED
- billing_start, billing_end: Date
- monthly_fee_usd: number

### Transaction
- user_id: reference to User
- amount: number
- currency: string
- status: pending | completed | failed
- type: deposit | withdrawal | transfer

### KYC
- user_id: reference to User
- status: pending | approved | rejected | under_review
- documentType: string
- verificationDate: Date

## Security Notes

1. **JWT Secret**: Change `JWT_SECRET` in production
2. **Admin Password**: Change default admin password after first login
3. **CORS**: Configure CORS origins in production
4. **HTTPS**: Use HTTPS in production
5. **Database**: Use strong MongoDB credentials
6. **Email**: Verify email configuration for notifications

## Next Steps

1. Create additional admin users with different roles
2. Configure email notifications
3. Set up monitoring and logging
4. Implement backup strategy
5. Deploy to production environment

## Support

For issues or questions, refer to:
- Backend docs: `admin-backend/COMPLETE_SETUP.md`
- API docs: `admin-backend/API_DOCUMENTATION.md`
- Dashboard docs: `admin-dashboard/README.md`
