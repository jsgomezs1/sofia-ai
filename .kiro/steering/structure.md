# Project Structure

## Directory Organization

```
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints (connection details, recording)
│   ├── rooms/[roomName]/  # Dynamic room pages
│   ├── custom/            # Custom video conference implementation
│   ├── theme-test/        # Theme testing page
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Home page
│
├── components/            # React components
│   └── ui/               # shadcn/ui components (50+ components)
│
├── lib/                   # Shared utilities and custom components
│   ├── *Settings.tsx     # Camera/Microphone settings components
│   ├── client-utils.ts   # Client-side utilities
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # General utilities (cn, etc.)
│
├── hooks/                 # Custom React hooks
│   └── use-mobile.ts     # Mobile detection hook
│
├── styles/                # Global and module CSS
│   ├── globals.css       # Tailwind base + CSS variables
│   └── *.module.css      # Component-specific styles
│
├── public/                # Static assets
│   ├── images/           # App images and icons
│   └── background-images/ # Virtual background images
│
└── .kiro/                 # Kiro AI assistant configuration
    ├── steering/         # AI guidance documents
    └── settings/         # MCP and other settings
```

## Key Conventions

### File Naming
- React components: PascalCase (e.g., `VideoConferenceClientImpl.tsx`)
- Utilities: camelCase (e.g., `client-utils.ts`)
- CSS Modules: `ComponentName.module.css`
- API routes: `route.ts` in folder structure

### Import Aliases
- `@/components` → `./components`
- `@/lib` → `./lib`
- `@/hooks` → `./hooks`
- `@/ui` → `./components/ui`

### Component Patterns
- Server Components by default (Next.js App Router)
- Client Components marked with `'use client'` directive
- Page implementations split into `page.tsx` (server) and `PageClientImpl.tsx` (client)

### API Routes
- Located in `app/api/` following Next.js 15 conventions
- Use `route.ts` files with named exports (GET, POST, etc.)
- Return `NextResponse` objects

### Styling Approach
- Tailwind utility classes for most styling
- CSS variables for theming (defined in `globals.css`)
- CSS Modules for complex component-specific styles
- shadcn/ui components use `cn()` utility for class merging

### Code Quality
- ESLint with Next.js config
- Prettier with single quotes, trailing commas, 100 char line width
- TypeScript strict mode enabled
