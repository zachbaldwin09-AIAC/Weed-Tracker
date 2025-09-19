# Weed Tracker Mobile

A React Native mobile app for tracking cannabis strain experiences.

## Features

- Browse and search cannabis strains
- Rate strains with thumbs up/down
- Save favorite strains
- Add personal notes and experiences
- View user statistics and profile

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your phone (for testing)

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Scan the QR code with Expo Go (Android) or Camera app (iOS)

### Backend Connection

Make sure your backend server is running and update the API_BASE_URL in `src/services/api.ts` if needed:

- Development: `http://localhost:5000`
- Production: Update to your deployed backend URL

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Main app screens
├── services/       # API service layer
├── types.ts        # TypeScript type definitions
└── theme.ts        # UI theme configuration
```

## Built With

- React Native & Expo
- React Navigation
- React Native Paper (Material Design)
- TanStack Query (data fetching)
- TypeScript