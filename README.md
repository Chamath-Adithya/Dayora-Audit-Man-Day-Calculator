# 🧮 Dayora - Audit Man-Day Calculator

> **Professional audit planning made simple**  
> Calculate audit man-days instantly based on international standards (IAF MD 5:2019 and ISO/TS 22003:2022)

![Audit Calculator](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A modern, professional web application designed for certification professionals to streamline audit planning and resource allocation. Calculate audit man-days with precision using internationally recognized standards with proper database backend and accurate calculation methodology.

## ✨ Features

### 🎯 Core Functionality
- **✅ Accurate Calculations**: Fixed calculation logic based on proper IAF MD 5:2019 standards
- **🗄️ Database Backend**: PostgreSQL with Prisma ORM for reliable data persistence
- **📊 Multiple Standards**: Support for QMS, EMS, EnMS, FSMS, and Cosmetics GMP
- **🔍 Audit Types**: Initial certification, surveillance, and recertification audits
- **📈 Detailed Reports**: Comprehensive calculation breakdowns with stage distribution
- **📚 History Tracking**: Searchable calculation history with proper data persistence
- **⚙️ Admin Configuration**: Customizable calculation parameters with database storage
- **🔒 Audit Logging**: Complete audit trail of all actions
- **📤 Export Functionality**: CSV export with filtering options
- **🌐 Production Ready**: Deployed on Vercel with proper environment configuration

### 🎨 User Experience
- **🌓 Light/Dark Mode**: Elegant theme switching with persistence
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **⚡ Real-Time Calculations**: Instant results with detailed breakdowns
- **🔍 Smart Search & Filtering**: Find calculations quickly
- **📊 Statistics Dashboard**: Overview of calculation history and metrics

### 💾 Data Management
- **📈 Calculation History**: Save, view, and manage all calculations
- **📁 Export Functionality**: Download history as CSV files
- **🔄 Auto-Save**: Persistent storage with backend API
- **📋 Detailed Reports**: Comprehensive calculation breakdowns

### 🏗️ Technical Features
- **🔌 REST API**: Complete backend with CRUD operations
- **🎯 Type Safety**: Full TypeScript implementation
- **⚡ Performance**: Optimized for speed and reliability
- **🛡️ Error Handling**: Graceful fallbacks and user feedback
- **🔒 Data Validation**: Zod schemas for type-safe validation

## 🛠️ Technology Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible UI components
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Reliable database with Prisma ORM
- **Prisma** - Type-safe database access
- **Zod** - Schema validation
- **TypeScript** - End-to-end type safety

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Vercel Analytics** - Performance monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use Supabase/Neon for free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd React-audit-man-day-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   # Edit .env with your database URL
   ```

4. **Set up database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with default configuration
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 What's Fixed

### ✅ Calculation Methodology
- **Correct Base Man-Days**: Updated to proper IAF MD 5:2019 values
- **Accurate Employee Adjustments**: Fixed employee range calculations
- **Proper Risk Assessment**: Correct risk multiplier implementation
- **Stage Distribution**: Proper Stage 1/Stage 2 calculations for initial audits
- **HACCP Calculations**: Correct FSMS-specific HACCP study adjustments
- **Integrated Systems**: Proper reduction calculations for multiple standards

### ✅ Backend Infrastructure
- **Database Persistence**: PostgreSQL with Prisma ORM
- **Data Validation**: Zod schemas for type-safe validation
- **Error Handling**: Comprehensive error handling and logging
- **Audit Trail**: Complete logging of all actions
- **API Security**: Proper input validation and sanitization

### ✅ Production Features
- **Environment Configuration**: Proper environment variable management
- **Database Migrations**: Prisma migrations for schema changes
- **Seeding**: Default configuration seeding
- **Monitoring**: Audit logging for all operations
- **Deployment**: Vercel-ready with proper build process

## 📖 Usage Guide

### Creating a New Calculation

1. **Navigate to "New Calculation"** in the sidebar
2. **Fill in Client Details**:
   - Company name
   - Scope/Industry sector

3. **Configure Audit Parameters**:
   - Select management system standard (QMS, EMS, EnMS, FSMS, Cosmetics)
   - Choose audit type (Initial, Surveillance, Recertification)
   - Pick appropriate category (AI, AII, BI, etc.)

4. **Enter Organization Details**:
   - Number of employees
   - Number of sites
   - Risk/complexity level
   - HACCP studies (for FSMS only)
   - Integrated standards (optional)

5. **Calculate & Save**: Get instant results with detailed breakdowns

### Managing History

- **View All Calculations**: Access complete history in the History section
- **Search & Filter**: Find specific calculations by company, standard, or audit type
- **Export Data**: Download filtered results as CSV
- **Detailed View**: Click to see full calculation details

## 🗂️ Project Structure

```
audit-calculator/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── calculations/         # Calculation CRUD operations
│   │   ├── export/              # CSV export endpoint
│   │   └── stats/               # Statistics endpoint
│   ├── calculate/               # Calculation form page
│   ├── history/                 # History management page
│   ├── results/                 # Results display page
│   ├── admin/                   # Admin configuration page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   ├── calculation-form-fixed.tsx # Fixed calculation form
│   ├── results-display.tsx      # Results presentation
│   ├── history-management.tsx   # History interface
│   ├── theme-provider.tsx       # Theme context
│   ├── theme-toggle.tsx         # Theme switch button
│   ├── sidebar-nav.tsx          # Navigation sidebar
│   └── main-layout.tsx          # Page layout wrapper
├── lib/                         # Utility libraries
│   ├── api-client.ts            # Backend API client
│   ├── audit-calculator-fixed.ts # Fixed calculation engine
│   ├── storage-db.ts            # Database storage layer
│   ├── database.ts              # Prisma client
│   └── utils.ts                 # Helper functions
├── prisma/                      # Database schema and migrations
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seeding
├── public/                      # Static assets
└── styles/                      # Additional styles
```

## 🔌 API Reference

### Calculations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/calculations` | Get all calculations |
| `POST` | `/api/calculations` | Save new calculation |
| `GET` | `/api/calculations/[id]` | Get specific calculation |
| `PUT` | `/api/calculations/[id]` | Update calculation |
| `DELETE` | `/api/calculations/[id]` | Delete calculation |
| `DELETE` | `/api/calculations` | Clear all calculations |

### Statistics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stats` | Get calculation statistics |

### Export

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/export` | Export calculations as CSV |

## 🎯 Supported Standards & Categories

### Management Systems
- **QMS** - Quality Management System (ISO 9001)
- **EMS** - Environmental Management System (ISO 14001)
- **EnMS** - Energy Management System (ISO 50001)
- **FSMS** - Food Safety Management System (ISO 22000)
- **Cosmetics** - Good Manufacturing Practice

### Calculation Factors
- **Base Man-Days**: IAF MD 5:2019 compliant base values
- **Employee Adjustments**: Based on organization size
- **Risk Multipliers**: Low (0.8x), Medium (1.0x), High (1.2x)
- **Multi-Site**: Additional man-days for multiple locations
- **HACCP Studies**: FSMS-specific adjustments
- **Integrated Systems**: Reduction for multiple standards

### Audit Types
- **Initial Certification**: Stage 1 (30%) + Stage 2 (70%)
- **Surveillance**: 33% of initial audit man-days
- **Recertification**: 67% of initial audit man-days

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Vercel Deployment
1. Connect your GitHub repo to Vercel
2. Set environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Random secret key
   - `NEXTAUTH_URL`: Your Vercel app URL
3. Deploy and run database setup

## 🛠️ Development

### Available Scripts

```bash
# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:migrate     # Create and run migrations
npm run db:studio      # Open Prisma Studio
npm run db:seed        # Seed database with default data

# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
```

### Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/audit_calculator?schema=public"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

## 📊 Calculation Methodology

The calculator implements the following international standards:

- **IAF MD 5:2019**: International Accreditation Forum Mandatory Document
- **ISO/TS 22003:2022**: Requirements for bodies providing audit and certification

### Key Calculation Factors

1. **Base Man-Days**: Determined by organization category (IAF MD 5:2019 compliant)
2. **Employee Adjustments**: Scaling based on workforce size
3. **Multi-Site Factors**: Additional time for multiple locations
4. **Risk Multipliers**: Complexity adjustments (Low: 0.8x, Medium: 1.0x, High: 1.2x)
5. **Integrated System Efficiency**: Reduction for multiple standards (10% savings per standard)
6. **Stage Distribution**: 30% Stage 1, 70% Stage 2 (for initial audits)
7. **HACCP Studies**: FSMS-specific adjustments (0.5 man-days per study)

## 🔒 Security & Privacy

- **Data Validation**: Zod schemas for input validation
- **Audit Logging**: Complete trail of all actions
- **Database Security**: Proper connection handling and SSL
- **API Security**: Input sanitization and error handling
- **No External Tracking**: Privacy-focused implementation

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Verify DATABASE_URL and SSL settings
2. **Build Failures**: Ensure Prisma client is generated
3. **Calculation Errors**: Check input validation and standards

### Getting Help
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
- Review Vercel function logs
- Verify database connectivity and schema

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- **Documentation**: Check this README and [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join discussions in GitHub Discussions

## 🎯 Roadmap

- [x] ✅ Fixed calculation methodology
- [x] ✅ Database backend with Prisma
- [x] ✅ Proper data validation
- [x] ✅ Audit logging
- [x] ✅ Production deployment
- [ ] PDF report generation
- [ ] User authentication system
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] API rate limiting

---

**Built with ❤️ for certification professionals worldwide**

*Streamline your audit planning process with precision and confidence.*