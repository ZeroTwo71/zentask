"use client";

import { KanbanBoard } from "@/components/kanban/kanban-board";
import { AppHeader } from "@/components/shared/app-header";

export default function KanbanPage() {
  return (
    <div className="container mx-auto py-4 px-3 max-w-7xl overflow-hidden">
      <AppHeader
        title="ZenTask"
        description="A minimalist Kanban board for your daily tasks"
        version="1.0"
      />
      <main className="overflow-hidden">
        <KanbanBoard />
      </main>
      <footer className="mt-4 text-center text-xs text-muted-foreground">
        <p>ZenTask - Built with Next.js, Tailwind CSS and shadcn/ui</p>
      </footer>
    </div>
  );
}
