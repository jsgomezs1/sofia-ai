# Design Document

## Overview

This design document outlines the approach for redesigning the LiveKit interview application UI using shadcn/ui components. The redesign will transform the existing interface into a modern, professional interview platform while maintaining all LiveKit meeting functionality. The design follows a strict separation of concerns: shadcn/ui handles all visual presentation, while LiveKit SDK manages all meeting logic and real-time communication.

The redesigned interface will feature a clean, minimal aesthetic with a purple accent color scheme (#DEC9F2 primary, #E1D5F2 foreground) on a light gray background (#F2F2F2), creating a professional environment suitable for technical interviews.

## Architecture

### Component Structure

The application follows a layered architecture:

1. **Presentation Layer (shadcn/ui)**: All visual components, layouts, forms, buttons, and interactive elements
2. **Business Logic Layer (LiveKit)**: Room connections, track management, event handling, and state management
3. **Integration Layer**: Thin wrappers that connect LiveKit components with shadcn/ui presentation

### Key Architectural Principles

- **Separation of Concerns**: UI components never contain LiveKit logic; LiveKit logic never contains UI rendering
- **Composition Over Modification**: Wrap LiveKit components in shadcn/ui containers rather than modifying LiveKit internals
- **Documentation-Driven**: All LiveKit patterns verified against livekit-docs MCP; all shadcn usage verified against shadcn MCP
- **Type Safety**: Full TypeScript support with proper types from both shadcn and LiveKit
- **Accessibility**: Leverage shadcn's built-in accessibility features

### File Organization

```
app/
├── page.tsx                    # Home page with tech stack selection
├── rooms/[roomName]/
│   ├── page.tsx               # Room page wrapper
│   └── PageClientImpl.tsx     # Room client with shadcn UI
└── custom/
    ├── page.tsx               # Custom connection page
    └── VideoConferenceClientImpl.tsx

lib/
├── SettingsMenu.tsx           # Settings with shadcn Dialog/Tabs
├── CameraSettings.tsx         # Camera controls with shadcn Select
├── MicrophoneSettings.tsx     # Microphone controls with shadcn Select
├── RecordingIndicator.tsx     # Recording badge with shadcn Badge
└── client-utils.ts            # Utility functions (unchanged)

components/ui/                 # shadcn/ui components
├── button.tsx
├── card.tsx
├── dialog.tsx
├── select.tsx
├── tabs.tsx
├── input.tsx
├── checkbox.tsx
└── ... (other shadcn components)

styles/
└── globals.css                # Theme configuration with CSS variables
```

## Components and Interfaces

### 1. Home Page (app/page.tsx)

**Purpose**: Entry point for starting or joining interviews with tech stack selection

**shadcn Components Used**:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Button` (variants: default, outline)
- `Input`, `Textarea`
- `Checkbox`
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`

**Structure**:
```tsx
<main className="min-h-screen bg-background p-8">
  <div className="max-w-4xl mx-auto">
    {/* Header with logo and description */}
    <div className="text-center mb-8">
      <img src="/images/livekit-meet-home.svg" alt="LiveKit Meet" />
      <p className="text-muted-foreground mt-4">
        Open source video conferencing for technical interviews
      </p>
    </div>

    {/* Main content card */}
    <Card>
      <CardHeader>
        <CardTitle>Start Interview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="demo">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demo">Demo</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="demo">
            {/* Demo meeting tab with tech stack selection */}
            <TechStackSelection />
            <DemoMeetingForm />
          </TabsContent>

          <TabsContent value="custom">
            {/* Custom connection form */}
            <CustomConnectionForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
</main>
```

**LiveKit Integration**:
- No LiveKit logic on home page
- Forms collect data and navigate to room pages
- E2EE passphrase encoding uses existing `client-utils.ts` functions

### 2. Tech Stack Selection Component

**Purpose**: New feature allowing users to select their technical focus before joining

**shadcn Components Used**:
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`
- `Label`

**Structure**:
```tsx
<div className="space-y-4">
  <Label htmlFor="tech-stack">Select Tech Stack</Label>
  <Select onValueChange={setTechStack}>
    <SelectTrigger id="tech-stack">
      <SelectValue placeholder="Choose your stack" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Frontend</SelectLabel>
        <SelectItem value="react">React</SelectItem>
        <SelectItem value="vue">Vue.js</SelectItem>
        <SelectItem value="angular">Angular</SelectItem>
      </SelectGroup>
      <SelectGroup>
        <SelectLabel>Backend</SelectLabel>
        <SelectItem value="nodejs">Node.js</SelectItem>
        <SelectItem value="python">Python</SelectItem>
        <SelectItem value="java">Java</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</div>
```

**State Management**:
- Local state using React `useState`
- No backend integration in initial implementation
- Value stored for potential future use (room metadata, participant attributes)

### 3. PreJoin Component Wrapper

**Purpose**: Wrap LiveKit's PreJoin component with shadcn UI styling

**shadcn Components Used**:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`
- `Input`
- `Checkbox`
- `Select` (for device selection)
- `Button`

**LiveKit Integration**:
```tsx
// LiveKit PreJoin logic (verified against livekit-docs)
const [preJoinChoices, setPreJoinChoices] = useState<LocalUserChoices>();

const handlePreJoinSubmit = useCallback(async (values: LocalUserChoices) => {
  setPreJoinChoices(values);
  // Fetch connection details from API
  const connectionDetails = await fetchConnectionDetails(values);
  setConnectionDetails(connectionDetails);
}, []);

// shadcn/ui presentation
<div className="flex items-center justify-center min-h-screen bg-background">
  <Card className="w-full max-w-md">
    <CardHeader>
      <CardTitle>Join Interview</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* LiveKit PreJoin component wrapped in shadcn layout */}
      <PreJoin
        defaults={preJoinDefaults}
        onSubmit={handlePreJoinSubmit}
        onError={handlePreJoinError}
      />
    </CardContent>
  </Card>
</div>
```

**Design Notes**:
- LiveKit's PreJoin component handles device selection and preview
- shadcn Card provides the visual container
- All LiveKit event handlers remain unchanged

### 4. Video Conference Component

**Purpose**: Main meeting interface with shadcn UI controls

**shadcn Components Used**:
- `Button` (for meeting controls)
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` (for settings)
- `Badge` (for recording indicator)
- `Separator`

**LiveKit Integration**:
```tsx
// LiveKit room setup (verified against livekit-docs)
const room = useMemo(() => new Room(roomOptions), []);

useEffect(() => {
  room.on(RoomEvent.Disconnected, handleOnLeave);
  room.on(RoomEvent.EncryptionError, handleEncryptionError);
  room.on(RoomEvent.MediaDevicesError, handleError);

  room.connect(serverUrl, token, connectOptions);
  
  return () => {
    room.off(RoomEvent.Disconnected, handleOnLeave);
    // ... cleanup
  };
}, [room]);

// shadcn/ui presentation wrapping LiveKit VideoConference
<div className="h-screen bg-background">
  <RoomContext.Provider value={room}>
    <KeyboardShortcuts />
    <VideoConference
      chatMessageFormatter={formatChatMessageLinks}
      SettingsComponent={SettingsMenuWithShadcn}
    />
    <DebugMode />
    <RecordingIndicatorWithShadcn />
  </RoomContext.Provider>
</div>
```

**Design Notes**:
- LiveKit's VideoConference component handles all video/audio rendering
- Custom SettingsComponent prop allows shadcn UI integration
- All LiveKit room options and event handlers remain unchanged

### 5. Settings Menu Component

**Purpose**: Meeting settings with shadcn UI components

**shadcn Components Used**:
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
- `Button`
- `Label`

**Structure**:
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Settings</DialogTitle>
    </DialogHeader>

    <Tabs defaultValue="media">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="media">Media Devices</TabsTrigger>
        <TabsTrigger value="recording">Recording</TabsTrigger>
      </TabsList>

      <TabsContent value="media" className="space-y-6">
        {/* Camera settings */}
        <div className="space-y-2">
          <Label>Camera</Label>
          <CameraSettingsWithShadcn />
        </div>

        {/* Microphone settings */}
        <div className="space-y-2">
          <Label>Microphone</Label>
          <MicrophoneSettingsWithShadcn />
        </div>

        {/* Speaker settings */}
        <div className="space-y-2">
          <Label>Speaker & Headphones</Label>
          <Select>
            {/* LiveKit MediaDeviceMenu wrapped */}
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="recording">
        {/* Recording controls */}
        <RecordingControlsWithShadcn />
      </TabsContent>
    </Tabs>

    <DialogFooter>
      <Button onClick={() => setIsOpen(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**LiveKit Integration**:
- `useRoomContext()` hook to access room instance
- `useIsRecording()` hook for recording status
- `MediaDeviceMenu` component wrapped in shadcn Select
- All device selection logic remains unchanged

### 6. Camera and Microphone Settings

**Purpose**: Device selection with shadcn UI

**shadcn Components Used**:
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
- `Button` (for toggle controls)

**LiveKit Integration**:
```tsx
// LiveKit device management (verified against livekit-docs)
const { localParticipant } = useRoomContext();
const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

useEffect(() => {
  // Get available devices
  navigator.mediaDevices.enumerateDevices().then(setDevices);
}, []);

const handleDeviceChange = async (deviceId: string) => {
  await localParticipant.setCameraEnabled(true, { deviceId });
};

// shadcn/ui presentation
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <Select onValueChange={handleDeviceChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select camera" />
      </SelectTrigger>
      <SelectContent>
        {devices.map(device => (
          <SelectItem key={device.deviceId} value={device.deviceId}>
            {device.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    
    <Button
      variant="outline"
      size="icon"
      onClick={() => localParticipant.setCameraEnabled(!cameraEnabled)}
    >
      {/* Camera icon */}
    </Button>
  </div>
</div>
```

### 7. Recording Indicator

**Purpose**: Visual indicator for active recording

**shadcn Components Used**:
- `Badge` (variant: destructive for recording state)

**LiveKit Integration**:
```tsx
// LiveKit recording status (verified against livekit-docs)
const isRecording = useIsRecording();

// shadcn/ui presentation
{isRecording && (
  <div className="fixed top-4 right-4 z-50">
    <Badge variant="destructive" className="animate-pulse">
      <div className="w-2 h-2 bg-white rounded-full mr-2" />
      Recording
    </Badge>
  </div>
)}
```

## Data Models

### Theme Configuration

The color theme is implemented through CSS variables in `styles/globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 95%;           /* #F2F2F2 */
    --foreground: 0 0% 35%;           /* #595959 */
    
    --card: 0 0% 100%;                /* White */
    --card-foreground: 0 0% 35%;      /* #595959 */
    
    --popover: 0 0% 100%;             /* White */
    --popover-foreground: 0 0% 35%;   /* #595959 */
    
    --primary: 222 47% 87%;           /* #DEC9F2 */
    --primary-foreground: 222 47% 20%; /* Dark purple for text on purple */
    
    --secondary: 0 0% 90%;            /* Light gray */
    --secondary-foreground: 0 0% 35%; /* #595959 */
    
    --muted: 0 0% 90%;                /* Light gray */
    --muted-foreground: 0 0% 45%;     /* Medium gray */
    
    --accent: 222 47% 87%;            /* #DEC9F2 */
    --accent-foreground: 222 47% 82%; /* #E1D5F2 */
    
    --destructive: 0 84% 60%;         /* Red for errors */
    --destructive-foreground: 0 0% 98%; /* White */
    
    --border: 0 0% 85%;               /* Light gray */
    --input: 0 0% 85%;                /* Light gray */
    --ring: 222 47% 87%;              /* #DEC9F2 for focus rings */
    
    --radius: 0.5rem;                 /* Border radius */
  }
}
```

### LiveKit Data Models (Unchanged)

All LiveKit data models remain unchanged:

- `Room`: Main room instance with connection state
- `LocalParticipant`: Current user's participant object
- `RemoteParticipant`: Other participants in the room
- `Track`: Audio/video track objects
- `RoomOptions`: Configuration for room connection
- `RoomConnectOptions`: Options for connecting to room
- `LocalUserChoices`: PreJoin form data (username, audio/video enabled, device IDs)
- `ConnectionDetails`: Server URL and participant token

### Component Props Interfaces

```typescript
// Tech stack selection
interface TechStackSelectionProps {
  onSelect: (stack: string) => void;
  defaultValue?: string;
}

// Settings menu
interface SettingsMenuProps extends HTMLAttributes<HTMLDivElement> {
  // Inherits from shadcn Dialog props
}

// Camera/Microphone settings
interface DeviceSettingsProps {
  kind: 'videoinput' | 'audioinput' | 'audiooutput';
}

// Recording indicator
interface RecordingIndicatorProps {
  className?: string;
}
```

## Error Handling

### LiveKit Error Handling (Unchanged)

All existing LiveKit error handlers remain unchanged:

```typescript
// Connection errors
room.on(RoomEvent.Disconnected, handleOnLeave);
room.on(RoomEvent.EncryptionError, handleEncryptionError);
room.on(RoomEvent.MediaDevicesError, handleError);

// Device errors
const handleError = useCallback((error: Error) => {
  console.error(error);
  alert(`Encountered an unexpected error: ${error.message}`);
}, []);
```

### UI Error States

shadcn components provide built-in error states:

- Form validation errors using `FormMessage` component
- Input error states with `destructive` variant
- Alert dialogs for critical errors using `AlertDialog` component

```tsx
// Example: Form validation with shadcn
<FormField
  control={form.control}
  name="username"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <Input placeholder="Enter your name" {...field} />
      </FormControl>
      <FormMessage /> {/* Shows validation errors */}
    </FormItem>
  )}
/>
```

## Testing Strategy

### Component Testing

1. **shadcn UI Component Tests**:
   - Verify all buttons render with correct variants
   - Verify cards display content correctly
   - Verify forms handle input and validation
   - Verify dialogs open/close properly
   - Verify tabs switch content correctly

2. **LiveKit Integration Tests**:
   - Verify room connection logic unchanged
   - Verify track publishing/subscribing unchanged
   - Verify event handlers fire correctly
   - Verify device selection works
   - Verify recording controls function

3. **Visual Regression Tests**:
   - Verify color theme applied correctly
   - Verify spacing and layout consistent
   - Verify responsive design works
   - Verify accessibility features intact

### Testing Approach

- **Unit Tests**: Test individual shadcn component wrappers
- **Integration Tests**: Test LiveKit + shadcn UI integration points
- **E2E Tests**: Test complete user flows (join meeting, change settings, etc.)
- **Manual Testing**: Verify visual design and user experience

### Test Coverage Goals

- 100% of UI components use shadcn/ui (no custom UI components)
- 100% of LiveKit functionality remains working
- All existing features continue to work
- No TypeScript errors
- All accessibility features maintained

## Implementation Phases

### Phase 1: Theme Setup
- Configure CSS variables in `globals.css`
- Verify shadcn components installed
- Test color theme on sample components

### Phase 2: Home Page Redesign
- Replace home page UI with shadcn Card and Tabs
- Implement tech stack selection component
- Update demo and custom connection forms
- Verify navigation to room pages works

### Phase 3: PreJoin Component
- Wrap LiveKit PreJoin in shadcn Card
- Style input fields with shadcn Input
- Style checkboxes with shadcn Checkbox
- Style device selects with shadcn Select
- Verify PreJoin functionality unchanged

### Phase 4: Settings Menu
- Replace settings UI with shadcn Dialog
- Implement tabs with shadcn Tabs
- Update device selection with shadcn Select
- Update recording controls with shadcn Button
- Verify all settings functionality works

### Phase 5: Video Conference UI
- Wrap VideoConference in shadcn layout
- Update meeting controls with shadcn Button
- Update recording indicator with shadcn Badge
- Verify all meeting functionality works

### Phase 6: Testing and Polish
- Run full test suite
- Fix any TypeScript errors
- Verify accessibility
- Test on multiple browsers
- Final visual polish

## Design Decisions and Rationales

### 1. Why shadcn/ui?

- **Accessibility**: Built on Radix UI with ARIA compliance
- **Customization**: Full control over component styling
- **Type Safety**: Excellent TypeScript support
- **Composition**: Encourages component composition over modification
- **Modern**: Uses latest React patterns and Tailwind CSS

### 2. Why Separate UI from Logic?

- **Maintainability**: Easy to update UI without touching LiveKit logic
- **Testability**: Can test UI and logic independently
- **Clarity**: Clear boundaries between presentation and business logic
- **Flexibility**: Easy to swap UI library in future if needed

### 3. Why CSS Variables for Theme?

- **Consistency**: Single source of truth for colors
- **Flexibility**: Easy to add dark mode in future
- **Performance**: No runtime color calculations
- **Standards**: Uses standard CSS custom properties

### 4. Why Wrap Instead of Replace LiveKit Components?

- **Safety**: Preserves all LiveKit functionality
- **Verification**: Easy to verify against livekit-docs
- **Updates**: Easy to update LiveKit SDK without breaking UI
- **Best Practices**: Follows LiveKit's recommended patterns

## Documentation References

### LiveKit Documentation

All LiveKit patterns verified against:
- [Connecting to LiveKit](https://docs.livekit.io/home/client/connect.md)
- [Handling Events](https://docs.livekit.io/home/client/events.md)
- [Publishing Tracks](https://docs.livekit.io/home/client/tracks/publish.md)
- [Subscribing to Tracks](https://docs.livekit.io/home/client/tracks/subscribe.md)
- [React Components](https://docs.livekit.io/reference/components/react/)

### shadcn/ui Documentation

All shadcn usage verified against:
- Component API documentation via shadcn MCP
- Composition patterns via shadcn MCP
- Styling conventions via shadcn MCP
- TypeScript types via shadcn MCP

## Accessibility Considerations

### shadcn/ui Accessibility Features

- All components built on Radix UI with ARIA support
- Keyboard navigation built-in
- Screen reader support
- Focus management
- Color contrast compliance

### Additional Accessibility Requirements

- Maintain LiveKit's existing accessibility features
- Ensure all interactive elements keyboard accessible
- Provide proper ARIA labels for custom components
- Test with screen readers
- Verify color contrast ratios meet WCAG AA standards

## Performance Considerations

### Optimization Strategies

- Use React.memo for expensive shadcn components
- Maintain LiveKit's existing performance optimizations
- Avoid unnecessary re-renders
- Use proper React keys for lists
- Lazy load heavy components

### Performance Monitoring

- Monitor bundle size after adding shadcn components
- Verify no performance regression in video/audio
- Test on low-end devices
- Monitor memory usage

## Future Enhancements

### Potential Future Features

1. **Dark Mode**: Add dark theme using CSS variables
2. **Tech Stack Integration**: Connect tech stack selection to room metadata
3. **Custom Themes**: Allow users to customize color scheme
4. **Advanced Layouts**: Add more layout options for video tiles
5. **Mobile Optimization**: Enhanced mobile UI with shadcn components
6. **Internationalization**: Add multi-language support
7. **Accessibility Improvements**: Enhanced screen reader support

### Migration Path

The design allows for incremental enhancements:
- Each component can be updated independently
- Theme can be extended without breaking existing styles
- New shadcn components can be added as needed
- LiveKit SDK can be updated without UI changes
