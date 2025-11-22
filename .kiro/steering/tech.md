# Tech Stack

## Core Framework

- **Next.js 15.2.4** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.9.2** - Type-safe JavaScript

## LiveKit Integration

- `@livekit/components-react` (2.9.16) - Pre-built React components for video conferencing
- `livekit-client` (2.16.0) - Client SDK for WebRTC
- `livekit-server-sdk` (2.14.1) - Server-side SDK for token generation
- `@livekit/krisp-noise-filter` - Audio noise filtering
- `@livekit/track-processors` - Media track processing

## UI & Styling

- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **shadcn/ui** - Component library (New York style)
- **Radix UI** - Headless UI primitives
- **lucide-react** - Icon library
- CSS Modules for component-specific styles

## Form & State Management

- `react-hook-form` with `zod` validation
- `next-themes` for theme management
- `react-hot-toast` / `sonner` for notifications

## Package Manager

- **pnpm 10.18.2** (required)

## Common Commands

```bash
# Development
pnpm install          # Install dependencies
pnpm dev              # Start dev server (http://localhost:3000)

# Building
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format:check     # Check Prettier formatting
pnpm format:write     # Apply Prettier formatting

# Testing
pnpm test             # Run Vitest tests
```

## Environment Setup

Copy `.env.example` to `.env.local` and configure:
- LiveKit server URL
- LiveKit API key and secret
- Optional: Datadog logging configuration

## Node Requirements

- Node.js >= 18
