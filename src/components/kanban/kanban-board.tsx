"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

import { useConfetti } from "@/hooks/use-confetti";
import { useKanbanStore } from "@/store/kanban-store";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { NewTaskForm } from "@/components/kanban/new-task-form";
import { TaskEditDialog } from "@/components/kanban/task-edit-dialog";
import { Task } from "@/lib/types/kanban";

export function KanbanBoard() {
  // Get kanban state and actions from store
  const {
    tasks,
    columns,
    columnOrder,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderColumn,
  } = useKanbanStore();
  
  // Track task being edited and dialog state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Initialize confetti effect
  const { triggerConfetti, Confetti } = useConfetti();

  // Track active task during drag
  const [, setActiveTaskId] = useState<string | null>(null);

  // Configure DnD sensors for both mouse and touch interactions
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance before drag starts on desktop
      },
    }),
    useSensor(TouchSensor, {
      // Customize touch sensor behavior for mobile - reduced delay for more responsive drag
      activationConstraint: {
        delay: 150, // Short delay for touch to distinguish from tap/click (in ms)
        tolerance: 8, // Slightly higher tolerance for better mobile interaction
      },
    })
  );

  // Handle task addition
  const handleAddTask = (content: string) => {
    addTask(content);
  };

  // Handle task deletion
  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };
  
  // Handle opening edit dialog for a task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };
  
  // Handle saving task edits
  const handleSaveTaskEdit = (updates: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, updates);
    }
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id } = active;
    
    if (typeof id === "string") {
      setActiveTaskId(id);
    }
  };

  // Handle dragging over a different column
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    // Exit if no over target or same as active
    if (!over || active.id === over.id) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    
    // Find source column
    let sourceColumnId = "";
    Object.keys(columns).forEach((columnId) => {
      if (columns[columnId].taskIds.includes(activeId)) {
        sourceColumnId = columnId;
      }
    });
    
    // If source column not found, exit early to prevent errors
    if (!sourceColumnId) return;

    // Determine if dragging over a task or a column
    const isOverATask = Object.values(tasks).some(
      (task) => task.id === overId
    );

    if (isOverATask) {
      // Find which column the task is in
      let overColumnId = "";
      Object.keys(columns).forEach((columnId) => {
        if (columns[columnId].taskIds.includes(overId)) {
          overColumnId = columnId;
        }
      });
      
      // Exit if we couldn't find the column
      if (!overColumnId) return;

      // Only proceed if dragging over a task in a different column
      if (sourceColumnId !== overColumnId) {
        // Find index of over task in its column
        const overTaskIndex = columns[overColumnId].taskIds.indexOf(overId);
        
        // Exit if task position is invalid
        if (overTaskIndex === -1) return;
        
        // Move the task to the new column at the appropriate position
        const { isFirstTimeInDone } = moveTask(
          activeId,
          sourceColumnId,
          overColumnId,
          overTaskIndex
        );

        // Trigger confetti if task moved to Done column for first time
        if (isFirstTimeInDone) {
          triggerConfetti();
        }
      }
    } else {
      // If dropping directly into a column
      const isOverAColumn = Object.keys(columns).includes(overId);
      
      if (isOverAColumn && sourceColumnId !== overId) {
        // Ensure the column exists before trying to access its taskIds
        if (!columns[overId]) return;
        
        // Move task to end of the destination column
        const { isFirstTimeInDone } = moveTask(
          activeId,
          sourceColumnId,
          overId,
          columns[overId].taskIds.length
        );

        // Trigger confetti if task moved to Done column for first time
        if (isFirstTimeInDone) {
          triggerConfetti();
        }
      }
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Clear active task ID
    setActiveTaskId(null);
    
    // Exit if no over target
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    
    // Find which column contains the active task
    let sourceColumnId = "";
    Object.keys(columns).forEach((columnId) => {
      if (columns[columnId].taskIds.includes(activeId)) {
        sourceColumnId = columnId;
      }
    });
    
    // If source column not found, exit early to prevent errors
    if (!sourceColumnId || !columns[sourceColumnId]) return;

    // Determine if we're reordering within a column
    const isTaskInSameColumn = columns[sourceColumnId].taskIds.includes(overId);
    
    if (isTaskInSameColumn) {
      // Get the start and end indices of the task within the column
      const sourceTaskIds = columns[sourceColumnId].taskIds;
      const startIndex = sourceTaskIds.indexOf(activeId);
      const endIndex = sourceTaskIds.indexOf(overId);
      
      // Only reorder if positions are valid and changed
      if (startIndex !== -1 && endIndex !== -1 && startIndex !== endIndex) {
        reorderColumn(sourceColumnId, startIndex, endIndex);
      }
    }
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Task form */}
      <NewTaskForm onAddTask={handleAddTask} />
      
      {/* DnD context wrapper */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        // Better mobile handling without TypeScript errors
      >
        {/* Columns container */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-2 pb-2 max-w-full overflow-auto touch-pan-y">
          <SortableContext items={columnOrder}>
            {columnOrder.map((columnId) => {
              const column = columns[columnId];
              const columnTasks = column.taskIds.map((taskId) => tasks[taskId]);
              
              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  onDeleteTask={handleDeleteTask}
                  onEditTask={handleEditTask}
                />
              );
            })}
          </SortableContext>
        </div>
        
        {/* Confetti component for celebration */}
        <Confetti />
      </DndContext>

      {/* Task edit dialog */}
      <TaskEditDialog
        task={editingTask}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveTaskEdit}
      />
    </div>
  );
}
