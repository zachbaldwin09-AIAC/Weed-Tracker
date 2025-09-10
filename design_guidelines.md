# Weed Tracker App Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern health and lifestyle tracking apps like MyFitnessPal and Headspace, combined with cannabis-focused platforms like Leafly. The design prioritizes simplicity, trust, and accessibility while maintaining a modern, non-stigmatized aesthetic.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light Mode: Deep forest green (140 60% 25%) for primary actions and branding
- Dark Mode: Sage green (140 40% 70%) for primary elements
- Background: Clean whites (0 0% 98%) and deep charcoal (220 15% 12%)

**Accent Colors:**
- Success/Like: Fresh green (120 50% 45%)
- Warning/Neutral: Warm amber (45 85% 60%) - used sparingly
- Text: Charcoal gray (220 10% 20%) on light, soft white (0 0% 95%) on dark

**Visual Treatment:**
Subtle gradients from primary green to slightly lighter variant for cards and buttons. Clean, medical-inspired aesthetic that feels trustworthy and professional.

### B. Typography
- **Primary Font**: Inter (Google Fonts) - clean, modern sans-serif
- **Headings**: Semi-bold (600) for strain names and section titles
- **Body Text**: Regular (400) for descriptions and notes
- **Labels**: Medium (500) for form labels and metadata

### C. Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8 (p-2, m-4, h-6, gap-8)
- Tight spacing (2-4) for form elements and buttons
- Medium spacing (6) for card padding and section gaps
- Generous spacing (8) for major layout divisions

### D. Component Library

**Core UI Elements:**
- Rounded corner cards (rounded-lg) with subtle shadows
- Thumbs up/down toggle buttons with clear active states
- Clean input fields with floating labels
- Minimal navigation with bottom tab bar for mobile

**Navigation:**
- Fixed bottom navigation for mobile-first experience
- Simple header with app branding and user profile access
- Search functionality prominently placed

**Forms:**
- Floating label inputs for strain search and notes
- Large, accessible touch targets (44px minimum)
- Clear visual feedback for form validation

**Data Displays:**
- Card-based strain library with strain image, name, type, and THC percentage
- Simple badge system for strain types (Indica/Sativa/Hybrid)
- Clean typography hierarchy for strain details

**Overlays:**
- Bottom sheet modals for strain details and note-taking
- Simple confirmation dialogs for actions
- Loading states with subtle animations

### E. Animations
Minimal and purposeful:
- Gentle fade transitions between screens
- Smooth like/dislike button state changes
- Subtle card hover effects on larger screens

## Mobile-First Considerations
- Touch-friendly interface with generous tap targets
- Thumb-reachable navigation elements
- Optimized for one-handed use
- Progressive web app capabilities for app-like experience

## Images
**Iconography**: Simple, medical-inspired icons using Heroicons for consistency. Cannabis leaf icons used sparingly and tastefully integrated.