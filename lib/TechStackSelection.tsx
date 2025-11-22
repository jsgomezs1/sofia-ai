'use client';

import React from 'react';
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

interface TechStackSelectionProps {
  value?: string;
  onValueChange: (value: string) => void;
}

export function TechStackSelection({ value, onValueChange }: TechStackSelectionProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor="tech-stack" className="text-base font-medium">
        Select Your Tech Stack
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="tech-stack" className="h-11">
          <SelectValue placeholder="Choose a technology..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Frontend</SelectLabel>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue.js</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
            <SelectItem value="svelte">Svelte</SelectItem>
            <SelectItem value="nextjs">Next.js</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Backend</SelectLabel>
            <SelectItem value="nodejs">Node.js</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="go">Go</SelectItem>
            <SelectItem value="ruby">Ruby</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Full Stack</SelectLabel>
            <SelectItem value="mern">MERN Stack</SelectItem>
            <SelectItem value="mean">MEAN Stack</SelectItem>
            <SelectItem value="django">Django</SelectItem>
            <SelectItem value="springboot">Spring Boot</SelectItem>
            <SelectItem value="rails">Ruby on Rails</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
