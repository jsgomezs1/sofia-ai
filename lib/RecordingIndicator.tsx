import { useIsRecording } from '@livekit/components-react';
import * as React from 'react';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { Circle } from 'lucide-react';

export function RecordingIndicator() {
  // LiveKit hook to check recording status
  const isRecording = useIsRecording();
  const [wasRecording, setWasRecording] = React.useState(false);

  React.useEffect(() => {
    if (isRecording !== wasRecording) {
      setWasRecording(isRecording);
      if (isRecording) {
        toast('This interview session is being recorded', {
          duration: 4000,
          icon: '🎥',
          position: 'top-center',
          style: {
            backgroundColor: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
            padding: '1rem',
            fontWeight: '500',
          },
        });
      }
    }
  }, [isRecording]);

  // Only render the badge when recording is active
  if (!isRecording) {
    return null;
  }

  // Sofia.AI styled Badge component with pulse animation
  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge
        variant="destructive"
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium shadow-lg animate-pulse"
      >
        <Circle className="w-2 h-2 fill-white" />
        Recording
      </Badge>
    </div>
  );
}
