"use client";

import { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Task, TaskPriority } from "@/lib/types/kanban";
import { PRIORITY_LABELS } from "./task-edit-dialog";

// Define priority colors
const PRIORITY_COLORS: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  [TaskPriority.MEDIUM]: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  [TaskPriority.HIGH]: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
  // Track if we're in a drag operation to prevent click handling during drag
  const [isDragOperation, setIsDragOperation] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  // State untuk menyimpan nomor animasi yang akan digunakan (0-4)
  const [animationVariant, setAnimationVariant] = useState<number | null>(null);
  
  // Setup sortable functionality for drag and drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    over,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });
  
  // Handle drag state changes without violating React hooks rules
  useEffect(() => {
    if (isDragging) {
      setIsDragOperation(true);
    }
  }, [isDragging]);

  // Check if the task is being dropped in the Done column and animate accordingly
  useEffect(() => {
    // Skip this effect when dragging to prevent constant updates
    if (isDragging) return;
    
    // Only process this when 'over' actually changed and we're over the done column
    // This prevents infinite update loops
    const isDoneColumn = over?.id === 'done';
    if (isDoneColumn && !hasAnimated) {
      // Use a callback form of setState to avoid dependency issues
      setAnimationVariant(() => Math.floor(Math.random() * 5));
      setHasAnimated(true);
    }
  }, [over?.id, hasAnimated, isDragging]); // Only depend on over.id, not the entire over object

  // Reset drag operation flag when it ends
  useEffect(() => {
    if (!isDragging && isDragOperation) {
      // Small delay to avoid immediate click handling after drag
      const timer = setTimeout(() => setIsDragOperation(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isDragging, isDragOperation]);

  // Handle task card click for editing, especially useful on mobile
  const handleTaskClick = (e: React.MouseEvent) => {
    // Don't handle click if we're in the middle of a drag operation
    if (isDragOperation || isDragging) return;
    
    // Prevent event bubbling
    e.stopPropagation();
    
    // Check if we clicked on a button element or its children
    let target = e.target as HTMLElement;
    while (target && target !== e.currentTarget) {
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        return; // Exit if clicked on a button (edit or delete icons)
      }
      target = target.parentElement!;
    }
    
    // If we didn't click on a button, trigger edit
    onEdit(task);
  };

  // Apply styles for dragging
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={`mb-2 shadow-sm hover:shadow-md transition-shadow duration-200 group relative ${over?.id === 'done' && !isDragging ? 'task-done-animation' : ''} ${animationVariant !== null ? `task-done-animation-${animationVariant}` : ''} ${!isDragging ? 'cursor-pointer kanban-draggable card-container' : ''}`}
        onClick={handleTaskClick}
        {...attributes}
        {...listeners}
      >
        <CardContent className="p-2 text-sm">
          <div className="flex justify-between items-start mb-1">
            <Badge variant="outline" className={`text-xs py-0 h-5 px-2 ${PRIORITY_COLORS[task.priority]}`}>
              {PRIORITY_LABELS[task.priority]}
            </Badge>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 rounded-full p-0" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
              >
                <Edit2 className="h-3 w-3" />
                <span className="sr-only">Edit task</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 rounded-full p-0" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
                <span className="sr-only">Delete task</span>
              </Button>
            </div>
          </div>
          <p className="line-clamp-2 text-sm my-1">{task.content}</p>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {task.description}
            </p>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete(task.id);
                setIsDeleteDialogOpen(false);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
