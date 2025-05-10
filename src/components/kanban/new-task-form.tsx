"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface NewTaskFormProps {
  onAddTask: (content: string) => void;
}

export function NewTaskForm({ onAddTask }: NewTaskFormProps) {
  const [taskContent, setTaskContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!taskContent.trim()) return;
    
    // Add task and reset form
    onAddTask(taskContent);
    setTaskContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3 flex flex-col gap-1">
      <div>
        <Label htmlFor="task-content" className="text-sm font-medium mb-1 inline-block">New Task</Label>
        <div className="flex gap-1">
          <Input
            id="task-content"
            placeholder="What needs to be done?"
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            className="flex-1 h-8 text-sm"
          />
          <Button type="submit" disabled={!taskContent.trim()} size="sm" className="h-8 px-2">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Task
          </Button>
        </div>
      </div>
    </form>
  );
}
