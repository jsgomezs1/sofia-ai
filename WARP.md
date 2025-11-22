# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Sofia.AI is a technical interview platform built on Next.js 15, LiveKit real-time video SDK, and shadcn/ui components. The application enables AI-powered video interview sessions with features like E2EE, recording, and background effects.

## Development Commands

### Package Management
- Install dependencies: `pnpm install`
- Package manager: pnpm (v10.18.2 required, enforced by packageManager field)

### Development Server
- Start dev server: `pnpm dev` (runs on http://localhost:3000)
- Build production: `pnpm build`
- Start production: `pnpm start`

### Code Quality
- Lint: `pnpm lint`
- Lint and fix: `pnpm lint:fix`
- Format check: `pnpm format:check`
- Format write: `pnpm format:write`

### Testing
- Run tests: `pnpm test` (uses Vitest)

## Environment Setup

Required environment variables in `.env.local`:
- `LIVEKIT_API_KEY` - LiveKit server API key
- `LIVEKIT_API_SECRET` - LiveKit server API secret
- `LIVEKIT_URL` - LiveKit server URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

Optional environment variables:
- `NEXT_PUBLIC_CONN_DETAILS_ENDPOINT` - Connection details endpoint (defaults to `/api/connection-details`)
- `NEXT_PUBLIC_SHOW_SETTINGS_MENU` - Enable settings menu ('true'/'false')
- `NEXT_PUBLIC_LK_RECORD_ENDPOINT` - Recording API endpoint
- `S3_KEY_ID`, `S3_KEY_SECRET`, `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION` - S3 configuration for recordings
- `NEXT_PUBLIC_DATADOG_CLIENT_TOKEN`, `NEXT_PUBLIC_DATADOG_SITE` - DataDog logging

See `SUPABASE_SETUP.md` for detailed Supabase configuration.

## Architecture

### Application Flow
1. **Landing Page** (`app/page.tsx`) - Interview configuration with tech stack selection and system checks
2. **Pre-Join** (`app/rooms/[roomName]/PageClientImpl.tsx`) - Device preview and participant name entry
3. **Video Conference** - Main interview session with LiveKit components

### Key Architectural Patterns

#### Server/Client Component Split
- **Server Components**: Page routes (`app/rooms/[roomName]/page.tsx`, `app/custom/page.tsx`) handle route params and initial rendering
- **Client Components**: Implementation files (`PageClientImpl.tsx`, `VideoConferenceClientImpl.tsx`) handle LiveKit logic and state
- This pattern keeps LiveKit's client-side logic separate from Next.js server rendering

#### LiveKit Integration
The application wraps LiveKit SDK in a specific pattern:
1. **Room Setup**: Create `Room` instance with `RoomOptions` (video codecs, simulcast layers, E2EE config)
2. **E2EE**: If enabled, setup `ExternalE2EEKeyProvider` and worker before connecting
3. **Connection**: Call `room.connect()` with server URL, token, and `RoomConnectOptions`
4. **Context**: Wrap UI in `RoomContext.Provider` to expose room to child components
5. **Components**: Use `VideoConference` component (from `@livekit/components-react`) for main UI

#### State Management
- React Context for room state (via `RoomContext.Provider`)
- Custom hooks in `lib/` for LiveKit-specific logic:
  - `useSetupE2EE()` - E2EE passphrase and worker initialization
  - `useLowCPUOptimizer()` - Performance optimization for low-end devices

#### API Routes
- `app/api/connection-details/route.ts` - Generate LiveKit tokens for room access
- `app/api/record/start/route.ts` - Start room recording via LiveKit Egress
- `app/api/record/stop/route.ts` - Stop room recording

### Component Organization

#### UI Components (`components/ui/`)
- shadcn/ui components (accordion, alert, button, card, dialog, select, tabs, etc.)
- All components use Tailwind CSS with CSS variables for theming
- Button variants: default, destructive, outline, secondary, ghost, link
- Use `cn()` utility from `lib/utils.ts` for className merging

#### Feature Components (`lib/`)
- `CameraSettings.tsx` - Camera selection with background blur/virtual background (LiveKit track processors)
- `MicrophoneSettings.tsx` - Microphone selection with Krisp noise cancellation
- `SettingsMenu.tsx` - Modal dialog with media and recording settings tabs
- `RecordingIndicator.tsx` - Fixed badge showing recording status with toast notifications
- `KeyboardShortcuts.tsx` - Keyboard shortcuts (Cmd/Ctrl-A for mic, Cmd/Ctrl-V for camera)
- `Debug.tsx` - Debug overlay (Shift+D) with room/participant info and DataDog integration
- `TechStackSelection.tsx` - Tech stack selector with Supabase integration and real-time updates

### Data Layer

#### Supabase Integration
- Client config: `lib/supabase.ts` with TypeScript types
- Database table: `tech` (id, created_at, name)
- `TechStackSelection` component subscribes to real-time changes on tech table
- See `SUPABASE_SETUP.md` for schema and setup instructions

### Video Features

#### End-to-End Encryption (E2EE)
- Passphrase stored in URL hash (after `#` symbol)
- Uses `ExternalE2EEKeyProvider` and Web Worker for encryption
- Codecs: When E2EE enabled, falls back from av1/vp9 to compatible codec
- Setup must complete before room connection

#### Recording
- Uses LiveKit Egress with S3Upload
- Room composite recording in 'speaker' layout
- Files: `{timestamp}-{roomName}.mp4` uploaded to S3
- Warning: Current implementation lacks authentication (see API route comments)

#### Performance Optimization
- `useLowCPUOptimizer` hook reduces quality on CPU-constrained devices
- Simulcast layers: HQ mode (h1080, h720) vs standard (h540, h216)
- Adaptive stream and dynacast enabled by default
- Hardware concurrency check: `navigator.hardwareConcurrency < 6` triggers optimizations

### Styling and Theming

#### Theme System
- Uses `next-themes` for dark/light mode switching
- Default theme: dark mode
- Purple accent colors: #DEC9F2 (primary), #E1D5F2 (accent foreground)
- Background: #F2F2F2, Text: #595959
- Theme toggle available via `ThemeToggle` component (currently commented out in header)

#### Fonts
- Sans: Geist (variable font)
- Mono: Geist Mono (variable font)

### TypeScript Configuration
- Path alias: `@/*` maps to project root
- Target: ES2020
- Module resolution: Bundler
- Strict mode enabled

## Development Notes

### LiveKit Components
The project uses `@livekit/components-react` which provides:
- `VideoConference` - Main video conferencing UI
- `PreJoin` - Pre-join lobby with device preview
- `useRoomContext`, `useLocalParticipant`, `useMediaDeviceSelect`, etc. - React hooks
- `formatChatMessageLinks` - Chat message formatter

### Next.js Configuration
- React Strict Mode: disabled (`reactStrictMode: false`)
- Source maps: enabled in production
- COOP/COEP headers: Required for SharedArrayBuffer (E2EE worker)
- Webpack: Custom rule for .mjs source maps

### Region Selection
- LiveKit Cloud URLs support region parameter
- `getLiveKitURL()` function inserts region into hostname
- Format: `{projectId}.{region}.{environment}.livekit.cloud`
- Tests in `lib/getLiveKitURL.test.ts` verify URL construction

### Custom Room Connection
- `app/custom/page.tsx` - Direct connection with URL params
- Params: `liveKitUrl`, `token`, `codec`, `singlePC`
- Error handling with shadcn/ui Alert components for missing params

## Common Patterns

### Adding New shadcn/ui Component
Components are already installed. Import from `@/components/ui/{component-name}`.

### Working with LiveKit Hooks
Always use within `RoomContext.Provider`. Common hooks:
- `useRoomContext()` - Access room instance
- `useLocalParticipant()` - Get local participant and tracks
- `useIsRecording()` - Check recording status
- `useTrackToggle()` - Toggle audio/video tracks

### Environment Variable Access
- Client-side: Prefix with `NEXT_PUBLIC_`
- Server-side: Access directly via `process.env`
- Validation: Check for undefined before use (see `lib/supabase.ts` example)

### E2EE Implementation
1. Get passphrase from URL hash: `location.hash.substring(1)`
2. Create worker: `new Worker(new URL('livekit-client/e2ee-worker', import.meta.url))`
3. Setup key provider and set passphrase
4. Enable E2EE: `room.setE2EEEnabled(true)`
5. Connect room after E2EE setup completes

### Recording Implementation
Recording requires:
1. LiveKit Egress API credentials
2. S3 bucket configuration
3. Recording endpoint in environment variables
4. Fetch `/api/record/start?roomName={name}` or `/api/record/stop?roomName={name}`
