import { videoCodecs } from 'livekit-client';
import { VideoConferenceClientImpl } from './VideoConferenceClientImpl';
import { isVideoCodec } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default async function CustomRoomConnection(props: {
  searchParams: Promise<{
    liveKitUrl?: string;
    token?: string;
    codec?: string;
    singlePC?: string;
  }>;
}) {
  const { liveKitUrl, token, codec, singlePC } = await props.searchParams;

  // Error states with shadcn/ui Alert components
  if (typeof liveKitUrl !== 'string') {
    return (
      <main
        className="min-h-screen bg-background p-6 md:p-8 flex items-center justify-center"
        data-lk-theme="default"
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Connection Error</CardTitle>
            <CardDescription>Unable to connect to Sofia.AI</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Missing Server URL</AlertTitle>
              <AlertDescription>
                A valid server URL is required to connect to the interview session.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (typeof token !== 'string') {
    return (
      <main
        className="min-h-screen bg-background p-6 md:p-8 flex items-center justify-center"
        data-lk-theme="default"
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Connection Error</CardTitle>
            <CardDescription>Unable to connect to Sofia.AI</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Missing Access Token</AlertTitle>
              <AlertDescription>
                A valid authentication token is required to connect to the interview session.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (codec !== undefined && !isVideoCodec(codec)) {
    return (
      <main
        className="min-h-screen bg-background p-6 md:p-8 flex items-center justify-center"
        data-lk-theme="default"
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Connection Error</CardTitle>
            <CardDescription>Unable to connect to Sofia.AI</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Invalid Video Codec</AlertTitle>
              <AlertDescription>
                The codec must be one of: {videoCodecs.join(', ')}.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Valid connection - render VideoConference
  return (
    <main data-lk-theme="default" className="h-screen bg-background">
      <VideoConferenceClientImpl
        liveKitUrl={liveKitUrl}
        token={token}
        codec={codec}
        singlePeerConnection={singlePC === 'true'}
      />
    </main>
  );
}
