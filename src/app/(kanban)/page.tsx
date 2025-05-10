"use client";

import { KanbanBoard } from "@/components/kanban/kanban-board";
import { AppHeader } from "@/components/shared/app-header";

export default function KanbanPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <AppHeader
        title="ZenTask"
        description="A minimalist Kanban board for your daily tasks"
        version="1.0"
      />
      <main>
        <KanbanBoard />
      </main>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>ZenTask - Built with Next.js, Tailwind CSS and shadcn/ui</p>
      </footer>
    </div>
  );
}
