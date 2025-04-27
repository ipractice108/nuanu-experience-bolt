# Nuanu Experience Platform

A comprehensive platform for managing and booking experiences, stays, and activities.

## Test Accounts

Use these accounts to test different roles:

```
Experience Manager:
- Email: experience@nuanu.com
- Password: 108108

Stay Manager:
- Email: stay@nuanu.com
- Password: 108108

Guide:
- Email: guide@nuanu.com
- Password: 108108

Member:
- Any email not listed above
- Any password

Admin:
- Email: daniel@nuanu.com
- Password: 108108
```

## Features

- Experience Management
  - Create and manage experiences
  - Schedule sessions
  - Set pricing and availability
  - Upload images
  - Location assignment

- Stay Management
  - Manage accommodations
  - Set pricing and availability
  - Gallery management
  - Amenities tracking

- Guide Management
  - Guide profiles
  - Session assignments
  - Commission tracking
  - Performance metrics

- Admin Dashboard
  - Worker credentials management
  - Access control
  - System monitoring

- User Features
  - Authentication
  - Booking system
  - Journey planning
  - Real-time availability
  - Location mapping

## Tech Stack

- Frontend
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - Lucide Icons

- Backend
  - Supabase
  - PostgreSQL
  - Edge Functions
  - Row Level Security

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update with your Supabase credentials

3. Start development server:
   ```bash
   npm run dev
   ```

4. Access the application:
   - Open `http://localhost:5173` in your browser
   - Use the test accounts above to try different roles

## Project Structure

```
nuanu-experience/
├── src/
│   ├── components/    # React components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utilities and configurations
│   ├── auth/         # Authentication logic
│   └── types/        # TypeScript type definitions
├── supabase/
│   ├── functions/    # Edge Functions
│   └── migrations/   # Database migrations
└── public/           # Static assets
```

## License

MIT