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
import {
  TrackReference,
  useLocalParticipant,
  useMediaDeviceSelect,
  useTrackToggle,
  VideoTrack,
} from '@livekit/components-react';
import { BackgroundBlur, VirtualBackground } from '@livekit/track-processors';
import { isLocalTrack, LocalTrackPublication, Track } from 'livekit-client';
import Desk from '../public/background-images/desk.jpeg';
import Nature from '../public/background-images/nature.jpg';

// Background image paths
const BACKGROUND_IMAGES = [
  { name: 'Desk', path: Desk },
  { name: 'Nature', path: Nature },
];

// Background options
type BackgroundType = 'none' | 'blur' | 'image';

// Component props interface with proper TypeScript types
interface CameraSettingsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CameraSettings(props: CameraSettingsProps = {}) {
  // LiveKit hooks and state
  const { cameraTrack, localParticipant } = useLocalParticipant();

  // LiveKit device selection hook
  const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({
    kind: 'videoinput',
  });

  // LiveKit track toggle hook
  const { enabled: cameraEnabled, toggle: toggleCamera } = useTrackToggle({
    source: Track.Source.Camera,
  });

  const [backgroundType, setBackgroundType] = React.useState<BackgroundType>(
    (cameraTrack as LocalTrackPublication)?.track?.getProcessor()?.name === 'background-blur'
      ? 'blur'
      : (cameraTrack as LocalTrackPublication)?.track?.getProcessor()?.name === 'virtual-background'
        ? 'image'
        : 'none',
  );

  const [virtualBackgroundImagePath, setVirtualBackgroundImagePath] = React.useState<string | null>(
    null,
  );

  // LiveKit track reference
  const camTrackRef: TrackReference | undefined = React.useMemo(() => {
    return cameraTrack
      ? { participant: localParticipant, publication: cameraTrack, source: Track.Source.Camera }
      : undefined;
  }, [localParticipant, cameraTrack]);

  // Background selection logic
  const selectBackground = (type: BackgroundType, imagePath?: string) => {
    setBackgroundType(type);
    if (type === 'image' && imagePath) {
      setVirtualBackgroundImagePath(imagePath);
    } else if (type !== 'image') {
      setVirtualBackgroundImagePath(null);
    }
  };

  // LiveKit background processor effect
  React.useEffect(() => {
    if (isLocalTrack(cameraTrack?.track)) {
      if (backgroundType === 'blur') {
        cameraTrack.track?.setProcessor(BackgroundBlur());
      } else if (backgroundType === 'image' && virtualBackgroundImagePath) {
        cameraTrack.track?.setProcessor(VirtualBackground(virtualBackgroundImagePath));
      } else {
        cameraTrack.track?.stopProcessor();
      }
    }
  }, [cameraTrack, backgroundType, virtualBackgroundImagePath]);

  return (
    <div {...props} className="flex flex-col gap-4">
      {/* LiveKit VideoTrack component */}
      {camTrackRef && (
        <VideoTrack
          style={{
            maxHeight: '280px',
            objectFit: 'contain',
            objectPosition: 'right',
            transform: 'scaleX(-1)',
            borderRadius: '0.5rem',
          }}
          trackRef={camTrackRef}
        />
      )}

      {/* Sofia.AI styled camera controls with LiveKit hooks */}
      <div className="flex items-center gap-3">
        <Select value={activeDeviceId} onValueChange={(deviceId) => setActiveMediaDevice(deviceId)}>
          <SelectTrigger className="flex-1 h-10">
            <SelectValue placeholder="Select camera" />
          </SelectTrigger>
          <SelectContent>
            {devices.map((device) => (
              <SelectItem key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={cameraEnabled ? 'default' : 'outline'}
          size="default"
          onClick={() => toggleCamera()}
          className={
            cameraEnabled
              ? 'min-w-[100px] bg-accent hover:bg-accent/90 text-accent-foreground'
              : 'min-w-[100px]'
          }
        >
          {cameraEnabled ? 'Camera On' : 'Camera Off'}
        </Button>
      </div>

      {/* Sofia.AI styled Background Effects section */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-foreground">Background Effects</div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={backgroundType === 'none' ? 'default' : 'outline'}
            size="sm"
            onClick={() => selectBackground('none')}
            className={
              backgroundType === 'none'
                ? 'min-w-[80px] bg-accent hover:bg-accent/90 text-accent-foreground'
                : 'min-w-[80px]'
            }
          >
            None
          </Button>

          <Button
            variant={backgroundType === 'blur' ? 'default' : 'outline'}
            size="sm"
            onClick={() => selectBackground('blur')}
            className={
              backgroundType === 'blur'
                ? 'min-w-[80px] h-[60px] relative overflow-hidden bg-accent hover:bg-accent/90 text-accent-foreground'
                : 'min-w-[80px] h-[60px] relative overflow-hidden'
            }
          >
            <div className="absolute inset-0 bg-muted" style={{ filter: 'blur(8px)', zIndex: 0 }} />
            <span className="relative z-10 bg-black/60 px-2 py-0.5 rounded text-xs">Blur</span>
          </Button>

          {BACKGROUND_IMAGES.map((image) => (
            <Button
              key={image.path.src}
              variant={
                backgroundType === 'image' && virtualBackgroundImagePath === image.path.src
                  ? 'default'
                  : 'outline'
              }
              size="sm"
              onClick={() => selectBackground('image', image.path.src)}
              className="w-[80px] h-[60px] p-0 overflow-hidden"
              style={{
                backgroundImage: `url(${image.path.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <span className="bg-black/60 px-2 py-0.5 rounded text-xs">{image.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
