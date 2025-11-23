# GharPey AI Command Centre

## Overview

GharPey AI Command Centre is a centralized AI-driven communication system designed to manage WhatsApp and email communications for connecting employers with domestic help (maids). The platform features multilingual support (English, Hindi, Kannada, Nepali), AI-powered message processing for sentiment analysis and translation, and a comprehensive contact management system. Built as a productivity-focused dashboard application, it emphasizes clarity, information density, and efficient workflow management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management with custom query client configuration

**UI Component System**
- Radix UI primitives for accessible, headless components
- shadcn/ui component library (New York style variant)
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for component variant management

**Design System**
- Typography: Inter for UI/body text, JetBrains Mono for technical data
- Modern productivity approach inspired by Linear, Notion, and Asana
- Custom color system with HSL values for theme support (light/dark modes)
- Responsive layout with defined spacing primitives (2, 4, 6, 8 units)

**State Management Pattern**
- Server state managed through React Query with infinite stale time
- Form state handled by React Hook Form with Zod validation resolvers
- Local UI state managed through React hooks
- Toast notifications via custom hook system

### Backend Architecture

**Server Framework**
- Express.js with TypeScript
- ESM module system throughout the codebase
- Separate development (tsx) and production (esbuild bundled) entry points
- Custom request logging middleware with timestamp formatting

**API Design**
- RESTful endpoints organized by resource (contacts, messages, templates, conversations)
- Request validation using Zod schemas derived from Drizzle schema
- Consistent error handling with appropriate HTTP status codes
- JSON response format throughout

**AI Integration Layer**
- OpenAI GPT-5 integration for message processing
- AI capabilities: language detection, sentiment analysis, intent recognition, translation, response generation
- Graceful fallback behavior when API key is not configured
- Isolated AI service module for maintainability

### Data Storage

**Database**
- PostgreSQL via Neon serverless with WebSocket connections
- Drizzle ORM for type-safe database queries
- Schema-first approach with TypeScript types generated from schema

**Schema Design**
- Users: Authentication and role-based access (admin, operator, manager)
- Contacts: Employer and maid profiles with language preferences
- Conversations: Multi-channel communication threads (WhatsApp, email)
- Messages: Bidirectional messages with status tracking and AI metadata
- Templates: Reusable message templates with variable substitution
- Workflows: Automated process definitions and execution tracking
- Notifications: System alerts and reminders

**Data Relationships**
- Contacts have many Conversations
- Conversations have many Messages
- Templates support multiple languages and channels
- Workflow instances track execution state

**Migration Strategy**
- Drizzle Kit for schema migrations
- Migration files stored in `/migrations` directory
- Push-based deployment via `db:push` command

### External Dependencies

**AI Services**
- OpenAI API (GPT-5 model) for natural language processing
- Used for: language detection, sentiment analysis, translation, response generation
- Configured via OPENAI_API_KEY environment variable

**Database Service**
- Neon Serverless PostgreSQL
- WebSocket-based connection pooling
- Configured via DATABASE_URL environment variable

**UI Component Libraries**
- Radix UI: 20+ primitive components for accessibility
- Embla Carousel: Touch-enabled carousel functionality
- Lucide React: Icon library
- date-fns: Date formatting and manipulation

**Development Tools**
- Replit-specific plugins: runtime error overlay, cartographer, dev banner
- Google Fonts: Inter and JetBrains Mono font families

**Session Management**
- connect-pg-simple for PostgreSQL-backed session storage
- Express session middleware integration

**Build & Development**
- tsx: TypeScript execution for development
- esbuild: Fast JavaScript bundler for production builds
- Vite plugins for React, error overlays, and Replit integration