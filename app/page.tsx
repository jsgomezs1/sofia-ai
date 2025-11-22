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
} from 'lucide-react';

// Mock data for recent interviews
const recentInterviews = [
  { id: 1, title: 'Frontend Interview', time: '2 hours ago', techStack: 'React, TypeScript' },
  { id: 2, title: 'Backend Assessment', time: 'Yesterday', techStack: 'Python, Django' },
  { id: 3, title: 'Full-Stack Interview', time: '2 days ago', techStack: 'Node.js, React' },
];

const templates = [
  { id: 1, name: 'Frontend Developer', stacks: ['React', 'TypeScript', 'CSS'] },
  { id: 2, name: 'Backend Developer', stacks: ['Python', 'Django', 'PostgreSQL'] },
  { id: 3, name: 'Full-Stack Developer', stacks: ['Node.js', 'React', 'MongoDB'] },
];

function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-muted/30 p-6 space-y-6">
      {/* Recent Interviews */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Recent
        </h3>
        <div className="space-y-2">
          {recentInterviews.map((interview) => (
            <button
              key={interview.id}
              className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary">
                    {interview.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{interview.time}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Stats */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Today
        </h3>
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-2xl font-bold">3</p>
          <p className="text-xs text-muted-foreground">Interviews conducted</p>
        </div>
      </div>

      <Separator />

      {/* Templates */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Templates
        </h3>
        <div className="space-y-2">
          {templates.map((template) => (
            <button
              key={template.id}
              className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors group"
            >
              <p className="text-sm font-medium group-hover:text-primary">{template.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{template.stacks.join(', ')}</p>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function InterviewConfiguration() {
  const router = useRouter();
  const [interviewTitle, setInterviewTitle] = useState('');
  const [e2ee, setE2ee] = useState(false);
  const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));
  const [techStack, setTechStack] = useState<string>('');
  const [micReady, setMicReady] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

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
    // Simulate brief loading
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (e2ee) {
      router.push(`/rooms/${generateRoomId()}#${encodePassphrase(sharedPassphrase)}`);
    } else {
      router.push(`/rooms/${generateRoomId()}`);
    }
  };

  const canStart = techStack !== '';

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
            Select a tech stack to enable interview start
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
