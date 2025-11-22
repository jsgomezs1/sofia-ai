'use client';

import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase, type Tech } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface TechStackSelectionProps {
  value?: string;
  onValueChange: (value: string) => void;
}

export function TechStackSelection({ value, onValueChange }: TechStackSelectionProps) {
  const [techStacks, setTechStacks] = useState<Tech[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechStacks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('tech')
          .select('*')
          .order('name', { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        setTechStacks(data || []);
      } catch (err) {
        console.error('Error fetching tech stacks:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tech stacks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTechStacks();

    // Optional: Set up real-time subscription
    const channel = supabase
      .channel('tech_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tech',
        },
        (payload) => {
          console.log('Tech stack change detected:', payload);
          // Refetch data on any change
          fetchTechStacks();
        },
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-3">
      <Label htmlFor="tech-stack" className="text-base font-medium">
        Select Your Tech Stack
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={isLoading || !!error}>
        <SelectTrigger id="tech-stack" className="h-11">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading technologies...</span>
            </div>
          ) : error ? (
            <span className="text-destructive">Error loading options</span>
          ) : (
            <SelectValue placeholder="Choose a technology..." />
          )}
        </SelectTrigger>
        <SelectContent className="bg-neutral-900">
          {error ? (
            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
              <p className="text-destructive mb-1">Failed to load tech stacks</p>
              <p className="text-xs">{error}</p>
            </div>
          ) : techStacks.length === 0 ? (
            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
              No tech stacks available
            </div>
          ) : (
            <SelectGroup>
              <SelectLabel>Available Technologies</SelectLabel>
              {techStacks.map((tech) => (
                <SelectItem key={tech.id} value={tech.name || ''}>
                  {tech.name}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs text-destructive">
          Please check your Supabase configuration and try again.
        </p>
      )}
    </div>
  );
}
