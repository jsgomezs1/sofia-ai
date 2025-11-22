'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { encodePassphrase, generateRoomId, randomString } from '@/lib/client-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TechStackSelection } from '@/lib/TechStackSelection';

function DemoMeetingTab() {
  const router = useRouter();
  const [e2ee, setE2ee] = useState(false);
  const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));
  const [techStack, setTechStack] = useState<string>('');

  const startMeeting = () => {
    if (e2ee) {
      router.push(`/rooms/${generateRoomId()}#${encodePassphrase(sharedPassphrase)}`);
    } else {
      router.push(`/rooms/${generateRoomId()}`);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">
        Start an interview session instantly with Sofia.AI
      </p>

      <TechStackSelection value={techStack} onValueChange={setTechStack} />

      <Separator />

      <Button
        onClick={startMeeting}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        size="lg"
      >
        Start Interview
      </Button>

      <div className="space-y-4 pt-2">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="use-e2ee-demo"
            checked={e2ee}
            onCheckedChange={(checked) => setE2ee(checked as boolean)}
          />
          <Label htmlFor="use-e2ee-demo" className="text-sm font-normal cursor-pointer">
            Enable end-to-end encryption
          </Label>
        </div>

        {e2ee && (
          <div className="space-y-2 pl-7">
            <Label htmlFor="passphrase-demo" className="text-sm">
              Passphrase
            </Label>
            <Input
              id="passphrase-demo"
              type="password"
              value={sharedPassphrase}
              onChange={(ev) => setSharedPassphrase(ev.target.value)}
              className="h-10"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function CustomConnectionTab() {
  const router = useRouter();
  const [e2ee, setE2ee] = useState(false);
  const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const serverUrl = formData.get('serverUrl');
    const token = formData.get('token');
    if (e2ee) {
      router.push(
        `/custom/?liveKitUrl=${serverUrl}&token=${token}#${encodePassphrase(sharedPassphrase)}`,
      );
    } else {
      router.push(`/custom/?liveKitUrl=${serverUrl}&token=${token}`);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <p className="text-muted-foreground text-sm">
        Connect to Sofia.AI using your own server configuration
      </p>

      <div className="space-y-3">
        <Label htmlFor="serverUrl" className="text-sm font-medium">
          Server URL
        </Label>
        <Input
          id="serverUrl"
          name="serverUrl"
          type="url"
          placeholder="wss://your-server.example.com"
          required
          className="h-10"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="token" className="text-sm font-medium">
          Access Token
        </Label>
        <Textarea
          id="token"
          name="token"
          placeholder="Enter your access token"
          required
          rows={5}
          className="resize-none"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="use-e2ee-custom"
            checked={e2ee}
            onCheckedChange={(checked) => setE2ee(checked as boolean)}
          />
          <Label htmlFor="use-e2ee-custom" className="text-sm font-normal cursor-pointer">
            Enable end-to-end encryption
          </Label>
        </div>

        {e2ee && (
          <div className="space-y-2 pl-7">
            <Label htmlFor="passphrase-custom" className="text-sm">
              Passphrase
            </Label>
            <Input
              id="passphrase-custom"
              type="password"
              value={sharedPassphrase}
              onChange={(ev) => setSharedPassphrase(ev.target.value)}
              className="h-10"
            />
          </div>
        )}
      </div>

      <Separator />

      <Button
        type="submit"
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        size="lg"
      >
        Connect to Interview
      </Button>
    </form>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams?.get('tab') === 'custom' ? 'custom' : 'demo';
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.push(`/?tab=${value}`);
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-2xl font-bold">Start Interview</CardTitle>
        <CardDescription className="text-base">
          Choose how you want to connect to your interview session
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <Tabs defaultValue={defaultTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="demo">Quick Start</TabsTrigger>
            <TabsTrigger value="custom">Custom Connection</TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="mt-0">
            <DemoMeetingTab />
          </TabsContent>

          <TabsContent value="custom" className="mt-0">
            <CustomConnectionTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  return (
    <>
      <main
        className="min-h-screen bg-background p-6 md:p-8 flex flex-col items-center justify-center"
        data-lk-theme="default"
      >
        <div className="w-full max-w-2xl space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Sofia.AI
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">Technical Interview Platform</p>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Conduct professional technical interviews with AI-powered assistance
            </p>
          </div>

          {/* Main Content Card */}
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <HomeContent />
          </Suspense>
        </div>
      </main>

      <footer
        className="w-full py-6 px-8 text-center text-muted-foreground bg-card border-t border-border"
        data-lk-theme="default"
      >
        <p className="text-sm">© 2025 Sofia.AI - Technical Interview Platform</p>
      </footer>
    </>
  );
}
