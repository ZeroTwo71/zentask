"use client";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Badge } from "@/components/ui/badge";

interface AppHeaderProps {
  title: string;
  description?: string;
  version?: string;
}

export function AppHeader({ 
  title, 
  description, 
  version 
}: AppHeaderProps) {
  return (
    <header className="mb-3 flex justify-between items-center">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          {version && (
            <Badge variant="outline" className="h-5 text-xs px-2">v{version}</Badge>
          )}
        </div>
        {description && (
          <p className="text-muted-foreground text-sm mt-0.5">
            {description}
          </p>
        )}
      </div>
      <ThemeToggle />
    </header>
  );
}
