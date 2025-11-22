'use client';

import * as React from 'react';
import { useLocalParticipant } from '@livekit/components-react';
import { Badge } from '@/components/ui/badge';
import { Smile, Meh, Frown, Flame } from 'lucide-react';

// Simple emotion taxonomy for the local participant.
// Emotion is expected to be provided via participant metadata as JSON, e.g.:
// { "emotion": "happy" }
export type Emotion = 'happy' | 'neutral' | 'sad' | 'stressed';

function parseEmotionFromMetadata(metadata?: string | null): Emotion | null {
  if (!metadata) return null;
  try {
    const parsed = JSON.parse(metadata) as { emotion?: string };
    const value = parsed.emotion?.toLowerCase();
    if (value === 'happy' || value === 'neutral' || value === 'sad' || value === 'stressed') {
      return value;
    }
    return null;
  } catch {
    // Ignore invalid JSON; treat as no emotion data
    return null;
  }
}

function getEmotionDisplay(emotion: Emotion) {
  switch (emotion) {
    case 'happy':
      return { label: 'Engaged', icon: <Smile className="w-3 h-3" /> };
    case 'sad':
      return { label: 'Disengaged', icon: <Frown className="w-3 h-3" /> };
    case 'stressed':
      return { label: 'Stressed', icon: <Flame className="w-3 h-3" /> };
    case 'neutral':
    default:
      return { label: 'Neutral', icon: <Meh className="w-3 h-3" /> };
  }
}

/**
 * EmotionIndicator
 *
 * Shows a small badge near the bottom control bar (to the left of the mic button)
 * with the current emotion of the local participant, derived from metadata.
 *
 * To feed real data, set `localParticipant.metadata` to a JSON string like:
 *   { "emotion": "happy" | "neutral" | "sad" | "stressed" }
 */
export function EmotionIndicator() {
  const { localParticipant } = useLocalParticipant();
  const [emotion, setEmotion] = React.useState<Emotion | null>(null);

  React.useEffect(() => {
    if (!localParticipant) return;

    const update = () => {
      setEmotion(parseEmotionFromMetadata(localParticipant.metadata ?? null));
    };

    update();

    // Poll periodically so changes to metadata are reflected without wiring up events.
    const intervalId = window.setInterval(update, 5000);
    return () => window.clearInterval(intervalId);
  }, [localParticipant]);

  // If no explicit emotion metadata is present, fall back to a neutral state
  const display = getEmotionDisplay(emotion ?? 'neutral');

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 -translate-x-[180px] z-40">
      <Badge
        variant="outline"
        className="pointer-events-auto bg-card/90 backdrop-blur flex items-center gap-1.5 px-3 py-1 rounded-full shadow"
      >
        {display.icon}
        <span className="text-[10px] font-semibold uppercase tracking-wide">Emotion</span>
        <span className="text-[10px] text-muted-foreground">{display.label}</span>
      </Badge>
    </div>
  );
}
