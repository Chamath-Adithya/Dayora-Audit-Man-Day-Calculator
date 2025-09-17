# Deployment Guide

## Overview
This guide covers deploying the Audit Man-Day Calculator to Vercel with a PostgreSQL database.

## Prerequisites
- Vercel account
- PostgreSQL database (recommended: Supabase, Neon, or Railway)
- Node.js 18+ (for local development)

## Database Setup

### Option 1: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Settings > Database
3. Copy the connection string (it looks like: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`)
4. Add `?sslmode=require` to the end of the connection string

### Option 2: Neon
1. Go to [neon.tech](https://neon.tech) and create a new project
2. Copy the connection string from the dashboard
3. Add `?sslmode=require` to the end of the connection string

### Option 3: Railway
1. Go to [railway.app](https://railway.app) and create a new PostgreSQL service
2. Copy the connection string from the service details
3. Add `?sslmode=require` to the end of the connection string

## Local Development Setup

### Option 1: SQLite (Recommended for Local Development)

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd React-audit-man-day-calculator
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database with default configuration
   npm run db:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Option 2: PostgreSQL (For Production-like Environment)

1. **Install PostgreSQL locally** or use Docker:
   ```bash
   # Using Docker
   docker run --name postgres-audit -e POSTGRES_PASSWORD=password -e POSTGRES_DB=audit_calculator -p 5432:5432 -d postgres:15
   ```

2. **Set up environment variables:**
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/audit_calculator?schema=public"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Follow the same database setup steps as above**

## Vercel Deployment

### 1. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically detect it's a Next.js project

### 2. Configure Environment Variables
In your Vercel project dashboard:
1. Go to Settings > Environment Variables
2. Add the following variables:

   ```
   DATABASE_URL = postgresql://user:password@host:port/database?sslmode=require
   NEXTAUTH_SECRET = your-random-secret-key
   NEXTAUTH_URL = https://your-app.vercel.app
   ```

### 3. Deploy
1. Vercel will automatically deploy on every push to main branch
2. Or manually trigger deployment from the dashboard

### 4. Set up Database (First Deployment)
After first deployment, you need to set up the database:

1. **Option A: Using Vercel CLI (Recommended)**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Link to your project
   vercel link
   
   # Run database setup
   vercel env pull .env.local
   npm run db:push
   npm run db:seed
   ```

2. **Option B: Using Prisma Studio (Alternative)**
   - Deploy first without database setup
   - Use a database client to run the SQL from `prisma/schema.prisma`
   - Or use Prisma Studio if you have database access

## Database Schema
The application uses the following main tables:

- **calculations**: Stores audit calculations
- **admin_configs**: Stores configuration settings
- **audit_logs**: Stores audit trail of actions

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes | `your-random-secret-key` |
| `NEXTAUTH_URL` | Your app URL | Yes | `https://your-app.vercel.app` |
| `SENTRY_DSN` | Sentry error tracking (optional) | No | `https://...@sentry.io/...` |

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL is correct
   - Ensure database allows connections from Vercel IPs
   - Check if SSL is required (`?sslmode=require`)

2. **Build Failures**
   - Ensure all environment variables are set
   - Check if Prisma client is generated (`npm run db:generate`)

3. **Runtime Errors**
   - Check Vercel function logs
   - Verify database schema is up to date
   - Ensure database is seeded with default config

### Useful Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database with default data
npm run db:seed
```

## Production Checklist

- [ ] Database is set up and accessible
- [ ] Environment variables are configured
- [ ] Database schema is deployed
- [ ] Default configuration is seeded
- [ ] SSL is enabled for database connection
- [ ] Error monitoring is set up (optional)
- [ ] Domain is configured (optional)

## Support

If you encounter issues:
1. Check the Vercel function logs
2. Verify database connectivity
3. Ensure all environment variables are set
4. Check if the database schema is up to date
