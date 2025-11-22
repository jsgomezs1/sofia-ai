'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ThemeTestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Theme Test Page
          </h1>
          <p className="text-muted-foreground">
            Testing shadcn/ui components with purple accent theme (#DEC9F2, #E1D5F2) and light gray background (#F2F2F2, #595959)
          </p>
        </div>

        {/* Buttons Section */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Testing button variants with purple accent</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="link">Link Button</Button>
          </CardContent>
        </Card>

        {/* Form Elements Section */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>Testing inputs, selects, and checkboxes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="test-input">Input Field</Label>
              <Input id="test-input" placeholder="Enter text here..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="test-select">Select Dropdown</Label>
              <Select>
                <SelectTrigger id="test-select">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="test-checkbox" />
              <Label htmlFor="test-checkbox">Checkbox with purple accent</Label>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Card>
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
            <CardDescription>Testing tab components with purple accent</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tab1">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-4">
                <p className="text-foreground">Content for Tab 1</p>
              </TabsContent>
              <TabsContent value="tab2" className="mt-4">
                <p className="text-foreground">Content for Tab 2</p>
              </TabsContent>
              <TabsContent value="tab3" className="mt-4">
                <p className="text-foreground">Content for Tab 3</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Testing badge variants</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Badge>Default Badge</Badge>
            <Badge variant="secondary">Secondary Badge</Badge>
            <Badge variant="outline">Outline Badge</Badge>
            <Badge variant="destructive">Destructive Badge</Badge>
          </CardContent>
        </Card>

        {/* Dialog Section */}
        <Card>
          <CardHeader>
            <CardTitle>Dialog</CardTitle>
            <CardDescription>Testing dialog component</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>
                    This is a test dialog with the purple accent theme.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-foreground">Dialog content goes here.</p>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Color Swatches */}
        <Card>
          <CardHeader>
            <CardTitle>Color Swatches</CardTitle>
            <CardDescription>Visual verification of theme colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-md bg-background border-2 border-border"></div>
                <p className="text-sm text-center">Background<br/>#F2F2F2</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-md bg-foreground"></div>
                <p className="text-sm text-center">Foreground<br/>#595959</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-md bg-primary"></div>
                <p className="text-sm text-center">Primary<br/>#DEC9F2</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-md bg-accent"></div>
                <p className="text-sm text-center">Accent<br/>#DEC9F2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multiple Cards to Test Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Testing card layout with multiple cards side by side.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Action</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card 2</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cards should have white background on light gray page background.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
