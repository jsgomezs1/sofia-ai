'use client';
import * as React from 'react';
import { Track } from 'livekit-client';
// LiveKit SDK imports - for room context and recording status
import {
  useMaybeLayoutContext,
  MediaDeviceMenu,
  TrackToggle,
  useRoomContext,
  useIsRecording,
} from '@livekit/components-react';
// shadcn/ui component imports - for UI presentation
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CameraSettings } from './CameraSettings';
import { MicrophoneSettings } from './MicrophoneSettings';

/**
 * @alpha
 */
export interface SettingsMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * @alpha
 */
export function SettingsMenu(props: SettingsMenuProps) {
  const layoutContext = useMaybeLayoutContext();

  // Track dialog open state - defaults to true when used as SettingsComponent in VideoConference
  const [isOpen, setIsOpen] = React.useState(true);

  // LiveKit Logic: Access room context and recording endpoint
  const room = useRoomContext();
  const recordingEndpoint = process.env.NEXT_PUBLIC_LK_RECORD_ENDPOINT;

  const settings = React.useMemo(() => {
    return {
      media: { camera: true, microphone: true, label: 'Media Devices', speaker: true },
      recording: recordingEndpoint ? { label: 'Recording' } : undefined,
    };
  }, [recordingEndpoint]);

  const tabs = React.useMemo(
    () =>
      Object.keys(settings).filter(
        (t) => settings[t as keyof typeof settings] !== undefined,
      ) as Array<keyof typeof settings>,
    [settings],
  );

  // LiveKit Logic: Track recording status using useIsRecording hook
  const isRecording = useIsRecording();
  const [initialRecStatus, setInitialRecStatus] = React.useState(isRecording);
  const [processingRecRequest, setProcessingRecRequest] = React.useState(false);

  React.useEffect(() => {
    if (initialRecStatus !== isRecording) {
      setProcessingRecRequest(false);
    }
  }, [isRecording, initialRecStatus]);

  // LiveKit Logic: Toggle room recording via API endpoint
  const toggleRoomRecording = async () => {
    if (!recordingEndpoint) {
      throw TypeError('No recording endpoint specified');
    }
    if (room.isE2EEEnabled) {
      throw Error('Recording of encrypted meetings is currently not supported');
    }
    setProcessingRecRequest(true);
    setInitialRecStatus(isRecording);
    let response: Response;
    if (isRecording) {
      response = await fetch(recordingEndpoint + `/stop?roomName=${room.name}`);
    } else {
      response = await fetch(recordingEndpoint + `/start?roomName=${room.name}`);
    }
    if (response.ok) {
      // Recording request successful
    } else {
      console.error(
        'Error handling recording request, check server logs:',
        response.status,
        response.statusText,
      );
      setProcessingRecRequest(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Notify LiveKit layout context to close settings
    layoutContext?.widget.dispatch?.({ msg: 'toggle_settings' });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Notify LiveKit layout context when dialog is closed
      layoutContext?.widget.dispatch?.({ msg: 'toggle_settings' });
    }
  };

  // Sofia.AI styled Dialog component for settings modal
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl" {...props}>
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl">Interview Settings</DialogTitle>
        </DialogHeader>

        {/* shadcn/ui Tabs component for organizing settings categories */}
        <Tabs defaultValue={tabs[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {settings[tab]?.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Media Devices Tab */}
          <TabsContent value="media" className="space-y-6 mt-0">
            {settings.media && settings.media.camera && (
              <div className="space-y-3">
                <Label className="text-base font-semibold text-foreground">Camera</Label>
                <CameraSettings />
              </div>
            )}

            {settings.media && settings.media.microphone && (
              <div className="space-y-3">
                <Label className="text-base font-semibold text-foreground">Microphone</Label>
                <MicrophoneSettings />
              </div>
            )}

            {settings.media && settings.media.speaker && (
              <div className="space-y-3">
                <Label className="text-base font-semibold text-foreground">
                  Speaker & Headphones
                </Label>
                <section className="lk-button-group">
                  <span className="lk-button">Audio Output</span>
                  <div className="lk-button-group-menu">
                    {/* LiveKit MediaDeviceMenu component for audio output selection */}
                    <MediaDeviceMenu kind="audiooutput" />
                  </div>
                </section>
              </div>
            )}
          </TabsContent>

          {/* Recording Tab */}
          {settings.recording && (
            <TabsContent value="recording" className="space-y-4 mt-0">
              <div className="space-y-3">
                <Label className="text-base font-semibold text-foreground">Record Interview</Label>
                <p className="text-sm text-muted-foreground">
                  {isRecording
                    ? 'Interview session is currently being recorded'
                    : 'No active recordings for this interview'}
                </p>
                {/* Sofia.AI styled Button component for recording controls */}
                <Button
                  disabled={processingRecRequest}
                  onClick={toggleRoomRecording}
                  variant={isRecording ? 'destructive' : 'default'}
                  className={
                    !isRecording ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''
                  }
                >
                  {isRecording ? 'Stop' : 'Start'} Recording
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* shadcn/ui DialogFooter with Close button */}
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
