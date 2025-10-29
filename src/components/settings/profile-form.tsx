"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";


export function ProfileForm() {
  const { toast } = useToast();
  const [threshold, setThreshold] = useState(500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings Saved",
      description: "Your energy profile has been updated.",
    });
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>User Profile & Preferences</CardTitle>        
        <CardDescription>
          Manage your account and customize your energy-saving settings.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Eco User" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="user@example.com" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
                <Label htmlFor="threshold">Energy Threshold</Label>
                <span className="text-lg font-bold text-primary">{threshold}W</span>
            </div>
            <p className="text-sm text-muted-foreground">Set a maximum energy consumption threshold. The AI will try to keep usage below this limit in occupied rooms.</p>
            <Slider
              id="threshold"
              min={100}
              max={2000}
              step={50}
              value={[threshold]}
              onValueChange={(value) => setThreshold(value[0])}
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </CardContent>
      </form>
    </Card>
  );
}
