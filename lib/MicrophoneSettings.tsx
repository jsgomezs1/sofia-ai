// shadcn/ui imports
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// LiveKit imports
import React from 'react';
import { useKrispNoiseFilter } from '@livekit/components-react/krisp';
import { useMediaDeviceSelect, useTrackToggle } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { isLowPowerDevice } from './client-utils';

// Component props interface with proper TypeScript types
interface MicrophoneSettingsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MicrophoneSettings(props: MicrophoneSettingsProps = {}) {
  // LiveKit Krisp noise filter hook
  const { isNoiseFilterEnabled, setNoiseFilterEnabled, isNoiseFilterPending } = useKrispNoiseFilter(
    {
      filterOptions: {
        bufferOverflowMs: 100,
        bufferDropMs: 200,
        quality: isLowPowerDevice() ? 'low' : 'medium',
        onBufferDrop: () => {
          console.warn(
            'krisp buffer dropped, noise filter versions >= 0.3.2 will automatically disable the filter',
          );
        },
      },
    },
  );

  // LiveKit device selection hook
  const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({
    kind: 'audioinput',
  });

  // LiveKit track toggle hook
  const { enabled: microphoneEnabled, toggle: toggleMicrophone } = useTrackToggle({
    source: Track.Source.Microphone,
  });

  React.useEffect(() => {
    // enable Krisp by default on non-low power devices
    setNoiseFilterEnabled(!isLowPowerDevice());
  }, [setNoiseFilterEnabled]);

  return (
    <div {...props} className="flex flex-col gap-4">
      {/* Sofia.AI styled microphone controls with LiveKit hooks */}
      <div className="flex items-center gap-3">
        <Select value={activeDeviceId} onValueChange={(deviceId) => setActiveMediaDevice(deviceId)}>
          <SelectTrigger className="flex-1 h-10">
            <SelectValue placeholder="Select microphone" />
          </SelectTrigger>
          <SelectContent>
            {devices.map((device) => (
              <SelectItem key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={microphoneEnabled ? 'default' : 'outline'}
          size="default"
          onClick={() => toggleMicrophone()}
          className={
            microphoneEnabled
              ? 'min-w-[120px] bg-accent hover:bg-accent/90 text-accent-foreground'
              : 'min-w-[120px]'
          }
        >
          {microphoneEnabled ? 'Mic On' : 'Mic Off'}
        </Button>
      </div>

      {/* Sofia.AI styled Enhanced Noise Cancellation button */}
      <Button
        variant={isNoiseFilterEnabled ? 'default' : 'outline'}
        size="default"
        onClick={() => setNoiseFilterEnabled(!isNoiseFilterEnabled)}
        disabled={isNoiseFilterPending}
        aria-pressed={isNoiseFilterEnabled}
        className={
          isNoiseFilterEnabled
            ? 'w-full bg-accent hover:bg-accent/90 text-accent-foreground'
            : 'w-full'
        }
      >
        {isNoiseFilterEnabled ? 'Disable' : 'Enable'} Enhanced Noise Cancellation
      </Button>
    </div>
  );
}
