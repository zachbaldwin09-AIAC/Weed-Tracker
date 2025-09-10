# Weed Tracker App

## Overview

A personal cannabis strain tracking application that allows users to discover, rate, and journal their experiences with different marijuana strains. The app features strain discovery through manual entry or photo analysis of packaging, personal rating system with thumbs up/down voting, note-taking capabilities, and a clean mobile-first interface inspired by health tracking apps like MyFitnessPal and cannabis platforms like Leafly.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite for build tooling
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design system featuring cannabis-inspired green color palette
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe forms

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API**: REST endpoints for CRUD operations on strains and user experiences
- **File Handling**: Multer for image upload processing with 10MB limit
- **Storage**: In-memory storage with interface abstraction for future database integration

### Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL with schema-first approach
- **Database**: Neon PostgreSQL (configured but currently using in-memory fallback)
- **Schema**: Three main entities - users, strains, and user_strain_experiences
- **Validation**: Zod schemas shared between client and server for type consistency

### Design System
- **Typography**: Inter font from Google Fonts for clean, modern aesthetic
- **Colors**: Deep forest green primary (light mode) and sage green (dark mode) with medical-inspired trustworthy palette
- **Layout**: Mobile-first responsive design with Tailwind spacing primitives
- **Components**: Rounded corners, subtle shadows, clean card-based layouts with consistent spacing

### Authentication and Authorization
- Currently not implemented - uses mock user ID system
- Architecture prepared for future session-based or JWT authentication

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Type-safe SQL ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation integration with Zod schemas

### UI Components
- **@radix-ui/***: Complete set of headless UI primitives for accessibility
- **lucide-react**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe variant system for component styling
- **cmdk**: Command palette component for search functionality

### Development Tools
- **tsx**: TypeScript execution for development server
- **esbuild**: Fast bundling for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling

### AI Integration
- **OpenAI GPT-5**: Image analysis for strain packaging recognition and data extraction
- Processes uploaded photos to automatically extract strain names, types, THC content, and descriptions

### File Processing
- **multer**: Multipart form handling for image uploads
- **ws**: WebSocket library required for Neon serverless connection