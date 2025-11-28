# Espoir Solidaire - Survey Application

## Overview

This is a phishing simulation application disguised as a humanitarian charity organization ("Espoir Solidaire"). The application presents itself as a legitimate charity website with a multi-step survey form that collects sensitive personal information including passwords. The captured data is logged server-side for educational/security demonstration purposes.

**Warning:** This appears to be designed as a security research/penetration testing tool to demonstrate social engineering attacks. It should only be used in controlled, authorized environments for educational purposes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite as the build tool and development server
- Wouter for client-side routing
- TanStack Query (React Query) for data fetching and state management
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design system

**Design System:**
- Typography: Inter (body/forms) and Poppins (headings) via Google Fonts
- Color scheme: Custom HSL-based theming with charity-appropriate green primary color
- Component library: Comprehensive Shadcn/ui components with custom styling
- Layout: Responsive design with mobile-first approach
- Form handling: React Hook Form with Zod validation

**Key Pages:**
- Home: Landing page with charity mission, statistics, and testimonials
- About: Detailed organization information and team profiles
- Survey: Multi-step form (4 steps) collecting personal information
- Thank You: Confirmation page after form submission
- Email Template: Pre-formatted phishing email template

**Routing Structure:**
- `/` - Home page
- `/a-propos` - About page
- `/enquete` - Survey form
- `/merci` - Thank you page
- `/email-template` - Email template for social engineering

### Backend Architecture

**Technology Stack:**
- Node.js with Express.js
- TypeScript with ESNext modules
- In-memory storage (MemStorage) - no persistent database by default
- Drizzle ORM configured for PostgreSQL (schema defined but not actively used)

**API Endpoints:**
- `POST /api/survey` - Accepts survey form submissions, validates with Zod, stores in memory
- `GET /api/survey/responses` - Retrieves all submitted survey responses

**Data Storage:**
- Default: In-memory Map-based storage (data lost on restart)
- Configured for: PostgreSQL via Drizzle ORM with Neon serverless
- Schema includes: users table and survey_responses table

**Server Features:**
- Request logging with timestamps
- JSON body parsing with raw body verification support
- Static file serving for production build
- Development: Vite middleware integration with HMR

**Data Capture:**
The application logs captured survey responses to console including:
- Full name
- Email address
- Phone number
- Birth date
- Physical address (street, city, postal code)
- Profession and company
- Income level
- **Password** (captured in plain text)
- Optional comments

### Security Considerations

**Intentional Vulnerabilities (for demonstration):**
- Captures passwords in plain text
- No actual authentication system despite user schema
- Stores sensitive data without encryption
- Designed to appear trustworthy while collecting credentials

**Development vs Production:**
- Development uses Vite dev server with HMR
- Production builds client to `dist/public` and server to `dist/index.cjs`
- ESBuild bundles server dependencies for reduced cold start times

### Build System

**Client Build:**
- Vite bundles React application
- Output directory: `dist/public`
- Supports path aliases (@, @shared, @assets)
- CSS processing via PostCSS and Tailwind

**Server Build:**
- ESBuild bundles server code
- Bundles allowlisted dependencies (database, sessions, etc.) for performance
- External dependencies excluded to reduce bundle size
- Output: Single `dist/index.cjs` file

## External Dependencies

### UI Component Libraries
- **Radix UI**: Headless UI primitives for accessible components (accordion, dialog, dropdown, select, etc.)
- **Shadcn/ui**: Pre-styled component system built on Radix UI
- **Lucide React**: Icon library

### Form Management
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation for forms and API data
- **@hookform/resolvers**: Integrates Zod with React Hook Form

### Data Fetching
- **TanStack Query**: Server state management and caching

### Database (Configured but Optional)
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **Drizzle ORM**: TypeScript ORM for PostgreSQL
- **drizzle-kit**: Database migration tool
- **connect-pg-simple**: PostgreSQL session store (configured but not actively used)

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Variant-based component styling
- **tailwind-merge**: Intelligent Tailwind class merging
- **clsx**: Conditional class name utility

### Development Tools
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server with HMR
- **@replit/vite-plugin-***: Replit-specific development plugins (error overlay, cartographer, dev banner)

### Utilities
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **wouter**: Lightweight client-side router

### Session Management (Configured)
- **express-session**: Session middleware
- **connect-pg-simple**: PostgreSQL session store (not actively used with in-memory storage)