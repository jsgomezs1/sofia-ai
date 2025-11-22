'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { encodePassphrase, generateRoomId, randomString } from '@/lib/client-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { TechStackSelection } from '@/lib/TechStackSelection';
import { ThemeToggle } from '@/components/theme-toggle';
import { supabase } from '@/lib/supabase';
import {
  Shield,
  Clock,
  CheckCircle2,
  Mic,
  Video,
  Settings,
  FileText,
  Menu,
  ChevronRight,
  User,
  Phone,
} from 'lucide-react';

function InterviewConfiguration() {
  const router = useRouter();
  const [interviewTitle, setInterviewTitle] = useState('');
  const [e2ee, setE2ee] = useState(false);
  const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));
  const [techStack, setTechStack] = useState<string>('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [micReady, setMicReady] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Check microphone and camera permissions
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMicReady(true);
        setCameraReady(true);
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.log('Permissions not granted yet');
      }
    };
    checkPermissions();
  }, []);

  const startInterview = async () => {
    setIsStarting(true);
    setSaveError(null);

    try {
      // Save user data to Supabase
      const { data, error } = await supabase
        .from('user')
        .insert({
          name: name.trim(),
          phone_number: phoneNumber.trim(),
        } as any)
        .select();

      if (error) {
        throw error;
      }

      console.log('User saved successfully:', data);

      // Simulate brief loading
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (e2ee) {
        router.push(`/rooms/${generateRoomId()}#${encodePassphrase(sharedPassphrase)}`);
      } else {
        router.push(`/rooms/${generateRoomId()}`);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save user data');
      setIsStarting(false);
    }
  };

  const canStart = techStack !== '' && name.trim() !== '' && phoneNumber.trim() !== '';

  return (
    <div className="flex-1 p-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">New Technical Interview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your interview settings and start when ready
          </p>
        </div>

        {/* Configuration Form */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Personal Information</h3>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Tech Stack Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Tech Stack <span className="text-destructive">*</span>
            </Label>
            <TechStackSelection value={techStack} onValueChange={setTechStack} />
            {!techStack && (
              <p className="text-xs text-muted-foreground">
                Select at least one technology to continue
              </p>
            )}
          </div>

          {/* System Check */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">System Check</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {micReady ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                )}
                <Mic className="h-4 w-4 text-muted-foreground" />
                <span className={micReady ? 'text-foreground' : 'text-muted-foreground'}>
                  Microphone {micReady ? 'Ready' : 'Not Detected'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {cameraReady ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                )}
                <Video className="h-4 w-4 text-muted-foreground" />
                <span className={cameraReady ? 'text-foreground' : 'text-muted-foreground'}>
                  Camera {cameraReady ? 'Ready' : 'Not Detected'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {name && phoneNumber ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                )}
                <User className="h-4 w-4 text-muted-foreground" />
                <span className={name && phoneNumber ? 'text-foreground' : 'text-muted-foreground'}>
                  Personal Info {name && phoneNumber ? 'Complete' : 'Required'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {techStack ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                )}
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className={techStack ? 'text-foreground' : 'text-muted-foreground'}>
                  Tech Stack {techStack ? 'Selected' : 'Required'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {saveError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-destructive font-medium">Error saving user data</p>
            <p className="text-xs text-destructive/80 mt-1">{saveError}</p>
          </div>
        )}

        {/* Start Button */}
        <Button
          onClick={startInterview}
          disabled={!canStart || isStarting}
          className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90"
          size="lg"
        >
          {isStarting ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Starting Interview...
            </>
          ) : (
            'Start Interview'
          )}
        </Button>

        {!canStart && (
          <p className="text-sm text-center text-muted-foreground">
            {!name || !phoneNumber
              ? 'Please fill in your personal information'
              : 'Select a tech stack to enable interview start'}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background" data-lk-theme="default">
      {/* Application Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="flex h-14 items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Sofia.AI</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground">Interview Platform</span>
          </div>

          {/* <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div> */}
        </div>
      </header>

      {/* Main Application Layout */}
      <div className="flex">
        {/* Main Content Area */}
        <InterviewConfiguration />
      </div>
    </div>
  );
}
