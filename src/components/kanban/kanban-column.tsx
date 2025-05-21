"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TaskCard } from "@/components/kanban/task-card";
import { Column, Task } from "@/lib/types/kanban";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

export function KanbanColumn({ column, tasks, onDeleteTask, onEditTask }: KanbanColumnProps) {
  // Setup droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  });

  // Get array of task IDs for this column
  const taskIds = tasks.map((task) => task.id);

  return (
    <Card 
      className={`w-full md:flex-1 md:min-w-[280px] md:h-[calc(100vh-170px)] h-[350px] flex flex-col border ${
        isOver ? "ring-2 ring-primary ring-opacity-50" : ""
      }`}
    >
      <CardHeader className="p-2 pb-1">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">{column.title}</CardTitle>
          <Badge variant="outline" className="h-5 text-xs px-2">{tasks.length}</Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent 
        ref={setNodeRef} 
        className="flex-1 overflow-y-auto p-2"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-6 text-sm italic">
              No tasks yet
            </p>
          ) : (
            tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onDelete={onDeleteTask}
                onEdit={onEditTask} 
              />
            ))
          )}
        </SortableContext>
      </CardContent>
    </Card>
  );
}
