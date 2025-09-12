# 🧮 Audit Man-Day Calculator

> **Professional audit planning made simple**  
> Calculate audit man-days instantly based on international standards (IAF MD 5:2019 and ISO/TS 22003:2022)

![Audit Calculator](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A modern, professional web application designed for certification professionals to streamline audit planning and resource allocation. Calculate audit man-days with precision using internationally recognized standards.

## ✨ Features

### 🎯 Core Functionality
- **Standards-Based Calculations**: IAF MD 5:2019 and ISO/TS 22003:2022 compliance
- **Multiple Audit Types**: Initial certification, surveillance, and recertification audits
- **Integrated Systems**: Support for multi-standard audits with efficiency calculations
- **Multi-Site Support**: Automatic adjustments for organizations with multiple locations
- **Risk Assessment**: Low, medium, and high complexity level calculations

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
- **File-based JSON Storage** - Simple, reliable data persistence
- **TypeScript** - End-to-end type safety

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Vercel Analytics** - Performance monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd audit-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

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

### Theme Switching

- **Toggle Button**: Located in the sidebar header (sun/moon icon)
- **Automatic Persistence**: Your theme preference is saved
- **System Integration**: Respects system dark mode preferences

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
│   ├── calculation-form.tsx     # Main calculation form
│   ├── results-display.tsx      # Results presentation
│   ├── history-management.tsx   # History interface
│   ├── theme-provider.tsx       # Theme context
│   ├── theme-toggle.tsx         # Theme switch button
│   ├── sidebar-nav.tsx          # Navigation sidebar
│   └── main-layout.tsx          # Page layout wrapper
├── lib/                         # Utility libraries
│   ├── api-client.ts            # Backend API client
│   ├── audit-calculator.ts      # Calculation engine
│   └── utils.ts                 # Helper functions
├── data/                        # Data storage
│   └── calculations.json        # Saved calculations
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

### Example API Usage

```typescript
// Save a calculation
const response = await fetch('/api/calculations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    companyName: "Tech Solutions Ltd",
    standard: "QMS",
    auditType: "initial",
    employees: 150,
    result: 8
    // ... other fields
  })
});

// Get all calculations
const calculations = await fetch('/api/calculations')
  .then(res => res.json());
```

## 🎯 Supported Standards & Categories

### Management Systems
- **QMS** - Quality Management System (ISO 9001)
- **EMS** - Environmental Management System (ISO 14001)
- **EnMS** - Energy Management System (ISO 50001)
- **FSMS** - Food Safety Management System (ISO 22000)
- **Cosmetics** - Good Manufacturing Practice

### Audit Categories
- **AI, AII** - Basic categories
- **BI, BII, BIII** - Intermediate categories  
- **C through K** - Advanced categories

### Audit Types
- **Initial Certification** - First-time certification audits
- **Surveillance** - Ongoing compliance audits
- **Recertification** - Certificate renewal audits

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Build Settings**: Next.js settings are detected automatically
3. **Deploy**: Automatic deployment on every push

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server  
npm run lint         # Run ESLint
```

### Environment Variables

Create a `.env.local` file:

```env
# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

### Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📊 Calculation Methodology

The calculator implements the following international standards:

- **IAF MD 5:2019**: International Accreditation Forum Mandatory Document
- **ISO/TS 22003:2022**: Requirements for bodies providing audit and certification

### Key Calculation Factors

1. **Base Man-Days**: Determined by organization category
2. **Employee Adjustments**: Scaling based on workforce size
3. **Multi-Site Factors**: Additional time for multiple locations
4. **Risk Multipliers**: Complexity adjustments (Low: 0.8x, Medium: 1.0x, High: 1.2x)
5. **Integrated System Efficiency**: Reduction for multiple standards (10-30% savings)
6. **Stage Distribution**: 30% Stage 1, 70% Stage 2 (for initial audits)

## 🔒 Security & Privacy

- **No Personal Data Collection**: Only audit calculation parameters are stored
- **Local Data Storage**: All data remains on your server
- **No External Tracking**: Privacy-focused implementation
- **Secure API Endpoints**: Input validation and sanitization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join discussions in GitHub Discussions

## 🎯 Roadmap

- [ ] PDF report generation
- [ ] User authentication system
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] API rate limiting
- [ ] Audit trail logging

---

**Built with ❤️ for certification professionals worldwide**

*Streamline your audit planning process with precision and confidence.*