'use client';

import React from 'react';
import { decodePassphrase } from '@/lib/client-utils';
import { DebugMode } from '@/lib/Debug';
import { KeyboardShortcuts } from '@/lib/KeyboardShortcuts';
import { RecordingIndicator } from '@/lib/RecordingIndicator';
import { SettingsMenu } from '@/lib/SettingsMenu';
import { ConnectionDetails } from '@/lib/types';
import { EmotionIndicator } from '@/lib/EmotionIndicator';
import {
  formatChatMessageLinks,
  LocalUserChoices,
  PreJoin,
  RoomContext,
  VideoConference,
} from '@livekit/components-react';
import {
  ExternalE2EEKeyProvider,
  RoomOptions,
  VideoCodec,
  VideoPresets,
  Room,
  DeviceUnsupportedError,
  RoomConnectOptions,
  RoomEvent,
  TrackPublishDefaults,
  VideoCaptureOptions,
} from 'livekit-client';
import { useRouter } from 'next/navigation';
import { useSetupE2EE } from '@/lib/useSetupE2EE';
import { useLowCPUOptimizer } from '@/lib/usePerfomanceOptimiser';
// shadcn/ui components for PreJoin screen
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const CONN_DETAILS_ENDPOINT =
  process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? '/api/connection-details';
const SHOW_SETTINGS_MENU = process.env.NEXT_PUBLIC_SHOW_SETTINGS_MENU == 'true';

export function PageClientImpl(props: {
  roomName: string;
  region?: string;
  hq: boolean;
  codec: VideoCodec;
}) {
  const [preJoinChoices, setPreJoinChoices] = React.useState<LocalUserChoices | undefined>(
    undefined,
  );
  const preJoinDefaults = React.useMemo(() => {
    return {
      username: '',
      videoEnabled: true,
      audioEnabled: true,
    };
  }, []);
  const [connectionDetails, setConnectionDetails] = React.useState<ConnectionDetails | undefined>(
    undefined,
  );

  const handlePreJoinSubmit = React.useCallback(async (values: LocalUserChoices) => {
    setPreJoinChoices(values);
    const url = new URL(CONN_DETAILS_ENDPOINT, window.location.origin);
    url.searchParams.append('roomName', props.roomName);
    url.searchParams.append('participantName', values.username);
    if (props.region) {
      url.searchParams.append('region', props.region);
    }
    const connectionDetailsResp = await fetch(url.toString());
    const connectionDetailsData = await connectionDetailsResp.json();
    setConnectionDetails(connectionDetailsData);
  }, []);
  const handlePreJoinError = React.useCallback((e: any) => console.error(e), []);

  return (
    <main data-lk-theme="default" style={{ height: '100%' }}>
      {connectionDetails === undefined || preJoinChoices === undefined ? (
        // shadcn/ui Card wrapper for PreJoin screen
        <div className="flex items-center justify-center min-h-screen bg-background p-6">
          <div className="w-full max-w-2xl space-y-6">
            {/* Sofia.AI Branding Header */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                Sofia.AI
              </h1>
              <p className="text-muted-foreground text-base">Technical Interview Platform</p>
            </div>

            {/* PreJoin Card */}
            <Card className="w-full shadow-lg">
              <CardHeader className="space-y-2 pb-4">
                <CardTitle className="text-2xl">Join Interview Session</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                {/* LiveKit PreJoin component - handles device selection, preview, and form submission */}
                <PreJoin
                  defaults={preJoinDefaults}
                  onSubmit={handlePreJoinSubmit}
                  onError={handlePreJoinError}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <VideoConferenceComponent
          connectionDetails={connectionDetails}
          userChoices={preJoinChoices}
          options={{ codec: props.codec, hq: props.hq }}
        />
      )}
    </main>
  );
}

function VideoConferenceComponent(props: {
  userChoices: LocalUserChoices;
  connectionDetails: ConnectionDetails;
  options: {
    hq: boolean;
    codec: VideoCodec;
  };
}) {
  // ============================================================================
  // LiveKit Logic: E2EE Setup
  // ============================================================================
  const keyProvider = new ExternalE2EEKeyProvider();
  const { worker, e2eePassphrase } = useSetupE2EE();
  const e2eeEnabled = !!(e2eePassphrase && worker);

  const [e2eeSetupComplete, setE2eeSetupComplete] = React.useState(false);

  // ============================================================================
  // LiveKit Logic: Room Options Configuration
  // Verified against: https://docs.livekit.io/home/client/connect.md
  // ============================================================================
  const roomOptions = React.useMemo((): RoomOptions => {
    let videoCodec: VideoCodec | undefined = props.options.codec ? props.options.codec : 'vp9';
    if (e2eeEnabled && (videoCodec === 'av1' || videoCodec === 'vp9')) {
      videoCodec = undefined;
    }
    const videoCaptureDefaults: VideoCaptureOptions = {
      deviceId: props.userChoices.videoDeviceId ?? undefined,
      resolution: props.options.hq ? VideoPresets.h2160 : VideoPresets.h720,
    };
    const publishDefaults: TrackPublishDefaults = {
      dtx: false,
      videoSimulcastLayers: props.options.hq
        ? [VideoPresets.h1080, VideoPresets.h720]
        : [VideoPresets.h540, VideoPresets.h216],
      red: !e2eeEnabled,
      videoCodec,
    };
    return {
      videoCaptureDefaults: videoCaptureDefaults,
      publishDefaults: publishDefaults,
      audioCaptureDefaults: {
        deviceId: props.userChoices.audioDeviceId ?? undefined,
      },
      adaptiveStream: true,
      dynacast: true,
      e2ee: keyProvider && worker && e2eeEnabled ? { keyProvider, worker } : undefined,
      singlePeerConnection: true,
    };
  }, [props.userChoices, props.options.hq, props.options.codec]);

  // ============================================================================
  // LiveKit Logic: Room Instance Creation
  // ============================================================================
  const room = React.useMemo(() => new Room(roomOptions), []);

  // ============================================================================
  // LiveKit Logic: E2EE Key Setup
  // ============================================================================
  React.useEffect(() => {
    if (e2eeEnabled) {
      keyProvider
        .setKey(decodePassphrase(e2eePassphrase))
        .then(() => {
          room.setE2EEEnabled(true).catch((e) => {
            if (e instanceof DeviceUnsupportedError) {
              alert(
                `You're trying to join an encrypted meeting, but your browser does not support it. Please update it to the latest version and try again.`,
              );
              console.error(e);
            } else {
              throw e;
            }
          });
        })
        .then(() => setE2eeSetupComplete(true));
    } else {
      setE2eeSetupComplete(true);
    }
  }, [e2eeEnabled, room, e2eePassphrase]);

  // ============================================================================
  // LiveKit Logic: Connection Options
  // Verified against: https://docs.livekit.io/home/client/connect.md
  // ============================================================================
  const connectOptions = React.useMemo((): RoomConnectOptions => {
    return {
      autoSubscribe: true,
    };
  }, []);

  // ============================================================================
  // LiveKit Logic: Room Connection and Event Handlers
  // Verified against: https://docs.livekit.io/home/client/events.md
  // Event handlers: RoomEvent.Disconnected, RoomEvent.EncryptionError, RoomEvent.MediaDevicesError
  // ============================================================================
  React.useEffect(() => {
    // Register event handlers before connecting
    room.on(RoomEvent.Disconnected, handleOnLeave);
    room.on(RoomEvent.EncryptionError, handleEncryptionError);
    room.on(RoomEvent.MediaDevicesError, handleError);

    if (e2eeSetupComplete) {
      // Connect to room with server URL and token
      room
        .connect(
          props.connectionDetails.serverUrl,
          props.connectionDetails.participantToken,
          connectOptions,
        )
        .catch((error) => {
          handleError(error);
        });

      // Publish tracks based on user choices
      if (props.userChoices.videoEnabled) {
        room.localParticipant.setCameraEnabled(true).catch((error) => {
          handleError(error);
        });
      }
      if (props.userChoices.audioEnabled) {
        room.localParticipant.setMicrophoneEnabled(true).catch((error) => {
          handleError(error);
        });
      }
    }

    // Cleanup: Remove event handlers on unmount
    return () => {
      room.off(RoomEvent.Disconnected, handleOnLeave);
      room.off(RoomEvent.EncryptionError, handleEncryptionError);
      room.off(RoomEvent.MediaDevicesError, handleError);
    };
  }, [e2eeSetupComplete, room, props.connectionDetails, props.userChoices]);

  // ============================================================================
  // LiveKit Logic: Performance Optimization
  // ============================================================================
  const lowPowerMode = useLowCPUOptimizer(room);

  // ============================================================================
  // LiveKit Logic: Event Handler Callbacks
  // ============================================================================
  const router = useRouter();
  const handleOnLeave = React.useCallback(() => router.push('/'), [router]);
  const handleError = React.useCallback((error: Error) => {
    console.error(error);
    alert(`Encountered an unexpected error, check the console logs for details: ${error.message}`);
  }, []);
  const handleEncryptionError = React.useCallback((error: Error) => {
    console.error(error);
    alert(
      `Encountered an unexpected encryption error, check the console logs for details: ${error.message}`,
    );
  }, []);

  React.useEffect(() => {
    if (lowPowerMode) {
      console.warn('Low power mode enabled');
    }
  }, [lowPowerMode]);

  // ============================================================================
  // Sofia.AI: Layout and Presentation
  // ============================================================================
  return (
    <div className="h-screen bg-background flex flex-col">
      {/* LiveKit RoomContext Provider - provides room instance to child components */}
      <RoomContext.Provider value={room}>
        {/* LiveKit Keyboard Shortcuts - handles keyboard shortcuts for meeting controls */}
        <KeyboardShortcuts />

        {/* Emotion indicator for the local participant, positioned near the mic button */}
        <EmotionIndicator />

        {/* LiveKit VideoConference Component - renders the main meeting interface
            Props remain unchanged to preserve all LiveKit functionality:
            - chatMessageFormatter: formats chat message links
            - SettingsComponent: custom settings menu component */}
        <VideoConference
          chatMessageFormatter={formatChatMessageLinks}
          SettingsComponent={SHOW_SETTINGS_MENU ? SettingsMenu : undefined}
        />

        {/* LiveKit Debug Mode - displays debug information */}
        <DebugMode />

        {/* Sofia.AI Recording Indicator - shows recording status */}
        <RecordingIndicator />
      </RoomContext.Provider>
    </div>
  );
}
