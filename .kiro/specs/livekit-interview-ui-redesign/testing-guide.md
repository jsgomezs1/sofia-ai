# Manual Testing Guide

This guide provides step-by-step instructions for manually testing the redesigned LiveKit Interview UI.

## Prerequisites

1. Ensure the development server is running:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:3000`

## Test Suite

### 1. Home Page Testing

#### Visual Verification
- [ ] Page loads with light gray background (#F2F2F2)
- [ ] LiveKit Meet logo displays centered
- [ ] Main content is in a white Card component
- [ ] Tabs component shows "Demo" and "Custom" options
- [ ] Purple accent color visible on interactive elements

#### Demo Tab
- [ ] Tech stack selection dropdown displays
- [ ] Can select from Frontend options (React, Vue, Angular)
- [ ] Can select from Backend options (Node.js, Python, Java)
- [ ] "Start Meeting" button has purple accent
- [ ] E2EE checkbox toggles correctly
- [ ] Passphrase field appears when E2EE enabled
- [ ] Passphrase field is hidden when E2EE disabled
- [ ] Clicking "Start Meeting" navigates to room page

#### Custom Tab
- [ ] LiveKit Server URL input field displays
- [ ] Token textarea displays
- [ ] E2EE checkbox toggles correctly
- [ ] Passphrase field appears/disappears correctly
- [ ] "Connect" button has purple accent
- [ ] Form validation works (required fields)

### 2. PreJoin Screen Testing

#### Visual Verification
- [ ] PreJoin screen displays in centered Card component
- [ ] Card has "Join Interview" title
- [ ] Purple accent visible on interactive elements
- [ ] Layout is centered on screen

#### Functionality
- [ ] Camera preview displays (if camera available)
- [ ] Microphone level indicator works (if mic available)
- [ ] Username input field works
- [ ] Camera device dropdown shows available cameras
- [ ] Microphone device dropdown shows available mics
- [ ] Camera toggle button works
- [ ] Microphone toggle button works
- [ ] "Join" button navigates to video conference

### 3. Video Conference Testing

#### Visual Verification
- [ ] Full-screen layout with light gray background
- [ ] Video tiles display correctly
- [ ] Control bar visible at bottom
- [ ] All buttons use shadcn/ui styling
- [ ] Purple accent on active/hover states

#### Core Functionality
- [ ] Local video displays
- [ ] Local audio works (check with another participant)
- [ ] Remote video displays (requires another participant)
- [ ] Remote audio works (requires another participant)
- [ ] Mute/unmute microphone button works
- [ ] Camera on/off button works
- [ ] Screen share button works
- [ ] Chat panel opens/closes
- [ ] Chat messages send and receive
- [ ] Participant list displays

#### Keyboard Shortcuts
- [ ] Space bar: Toggle microphone
- [ ] V: Toggle camera
- [ ] S: Toggle screen share
- [ ] C: Toggle chat
- [ ] Other shortcuts work as expected

### 4. Settings Menu Testing

#### Opening Settings
- [ ] Settings button opens Dialog component
- [ ] Dialog has "Settings" title
- [ ] Dialog displays centered on screen
- [ ] Tabs show "Media Devices" and "Recording" (if enabled)

#### Media Devices Tab
- [ ] Camera section displays
- [ ] Camera preview shows current camera feed
- [ ] Camera device dropdown lists available cameras
- [ ] Selecting camera switches device
- [ ] "Camera On/Off" button toggles camera
- [ ] Background effects section displays
- [ ] "None" button removes background effects
- [ ] "Blur" button applies blur effect
- [ ] Virtual background buttons apply images
- [ ] Microphone section displays
- [ ] Microphone device dropdown lists available mics
- [ ] Selecting microphone switches device
- [ ] "Mic On/Off" button toggles microphone
- [ ] "Enhanced Noise Cancellation" button toggles Krisp
- [ ] Speaker section displays (if supported)
- [ ] Speaker device dropdown lists available speakers

#### Recording Tab (if endpoint configured)
- [ ] Recording status displays correctly
- [ ] "Start Recording" button works
- [ ] "Stop Recording" button works
- [ ] Recording indicator appears when recording active
- [ ] Button changes to destructive variant when recording

#### Dialog Controls
- [ ] "Close" button closes dialog
- [ ] Clicking outside dialog closes it
- [ ] ESC key closes dialog

### 5. Recording Indicator Testing

#### Visual Verification
- [ ] Badge appears in top-right corner when recording
- [ ] Badge has red/destructive styling
- [ ] Badge shows "Recording" text
- [ ] Badge has white dot indicator
- [ ] Badge has pulse animation
- [ ] Toast notification appears when recording starts

#### Functionality
- [ ] Indicator only shows when recording active
- [ ] Indicator disappears when recording stops
- [ ] Indicator position is fixed (doesn't scroll)

### 6. E2EE Testing

#### Setup
- [ ] Enable E2EE on home page
- [ ] Enter a passphrase
- [ ] Start meeting

#### Functionality
- [ ] Meeting connects successfully
- [ ] Encryption indicator shows (if implemented)
- [ ] Video/audio works with encryption
- [ ] Second participant with same passphrase can join
- [ ] Second participant with different passphrase cannot decrypt

### 7. Custom Connection Testing

#### Valid Connection
- [ ] Navigate to custom tab
- [ ] Enter valid LiveKit URL
- [ ] Enter valid token
- [ ] Click "Connect"
- [ ] Meeting loads successfully

#### Error Handling
- [ ] Missing URL shows error Card with Alert
- [ ] Missing token shows error Card with Alert
- [ ] Invalid codec shows error Card with Alert
- [ ] Error messages are clear and helpful

### 8. Theme Consistency Testing

#### Color Verification
- [ ] Background is light gray (#F2F2F2) throughout
- [ ] Text is gray (#595959) throughout
- [ ] Primary buttons have purple accent (#DEC9F2)
- [ ] Hover states show purple accent
- [ ] Focus rings are purple
- [ ] Cards are white with subtle borders
- [ ] Consistent spacing throughout

#### Component Styling
- [ ] All buttons use shadcn Button component
- [ ] All cards use shadcn Card component
- [ ] All inputs use shadcn Input component
- [ ] All selects use shadcn Select component
- [ ] All dialogs use shadcn Dialog component
- [ ] All tabs use shadcn Tabs component
- [ ] All checkboxes use shadcn Checkbox component

### 9. Responsive Design Testing

#### Desktop (1920x1080)
- [ ] Layout looks good
- [ ] All elements visible
- [ ] No overflow issues

#### Laptop (1366x768)
- [ ] Layout adapts correctly
- [ ] All elements accessible
- [ ] No horizontal scroll

#### Tablet (768x1024)
- [ ] Layout responsive
- [ ] Touch targets adequate
- [ ] Video tiles adjust

#### Mobile (375x667)
- [ ] Layout mobile-friendly
- [ ] Controls accessible
- [ ] Text readable

### 10. Browser Compatibility Testing

#### Chrome/Edge
- [ ] All features work
- [ ] Video/audio quality good
- [ ] No console errors
- [ ] Performance good

#### Firefox
- [ ] All features work
- [ ] Video/audio quality good
- [ ] No console errors
- [ ] Performance good

#### Safari
- [ ] All features work
- [ ] Video/audio quality good
- [ ] No console errors
- [ ] Performance good

### 11. Accessibility Testing

#### Keyboard Navigation
- [ ] Tab key navigates through elements
- [ ] Enter/Space activates buttons
- [ ] ESC closes dialogs
- [ ] Focus indicators visible
- [ ] Logical tab order

#### Screen Reader
- [ ] Buttons have proper labels
- [ ] Form fields have labels
- [ ] ARIA attributes present
- [ ] Announcements make sense

#### Color Contrast
- [ ] Text readable on backgrounds
- [ ] Buttons have sufficient contrast
- [ ] Focus indicators visible
- [ ] Error messages clear

### 12. Performance Testing

#### Load Time
- [ ] Home page loads quickly
- [ ] PreJoin screen loads quickly
- [ ] Video conference loads quickly
- [ ] No long delays

#### Runtime Performance
- [ ] Smooth video playback
- [ ] No frame drops
- [ ] UI remains responsive
- [ ] No memory leaks (check DevTools)

#### Network Conditions
- [ ] Works on good connection
- [ ] Degrades gracefully on poor connection
- [ ] Reconnects after disconnect

## Console Verification

Open browser DevTools (F12) and check:

### Console Tab
- [ ] No JavaScript errors
- [ ] No React warnings
- [ ] Only expected LiveKit logs
- [ ] No 404 errors for resources

### Network Tab
- [ ] All resources load successfully
- [ ] WebSocket connection established
- [ ] No failed requests
- [ ] Reasonable bundle sizes

### Performance Tab
- [ ] No long tasks blocking UI
- [ ] Smooth frame rate
- [ ] No layout thrashing
- [ ] Good Core Web Vitals

## Issue Reporting

If you find any issues during testing, please document:

1. **Issue Description**: What went wrong?
2. **Steps to Reproduce**: How to recreate the issue?
3. **Expected Behavior**: What should happen?
4. **Actual Behavior**: What actually happened?
5. **Browser/OS**: Which browser and OS?
6. **Screenshots**: Visual evidence if applicable
7. **Console Logs**: Any error messages?

## Test Results Template

```markdown
## Test Results - [Date]

### Tester: [Name]
### Browser: [Browser Name/Version]
### OS: [Operating System]

### Home Page: ✅ PASS / ❌ FAIL
- Notes: 

### PreJoin Screen: ✅ PASS / ❌ FAIL
- Notes:

### Video Conference: ✅ PASS / ❌ FAIL
- Notes:

### Settings Menu: ✅ PASS / ❌ FAIL
- Notes:

### Recording: ✅ PASS / ❌ FAIL
- Notes:

### E2EE: ✅ PASS / ❌ FAIL
- Notes:

### Theme: ✅ PASS / ❌ FAIL
- Notes:

### Accessibility: ✅ PASS / ❌ FAIL
- Notes:

### Performance: ✅ PASS / ❌ FAIL
- Notes:

### Overall: ✅ PASS / ❌ FAIL
```

## Quick Smoke Test

For a quick verification, test this minimal flow:

1. ✅ Load home page - verify purple theme
2. ✅ Select a tech stack
3. ✅ Click "Start Meeting"
4. ✅ Enter username on PreJoin
5. ✅ Click "Join"
6. ✅ Verify video displays
7. ✅ Open settings menu
8. ✅ Change camera device
9. ✅ Close settings
10. ✅ Leave meeting

If all steps pass, the core functionality is working correctly.
