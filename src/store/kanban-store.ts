import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BoardState, ColumnId, COLUMN_TITLES, TaskPriority, Task } from '@/lib/types/kanban';

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Create initial/default board state
const createInitialState = (): BoardState => {
  const defaultColumns = {
    [ColumnId.TODO]: {
      id: ColumnId.TODO,
      title: COLUMN_TITLES[ColumnId.TODO],
      taskIds: [],
    },
    [ColumnId.IN_PROGRESS]: {
      id: ColumnId.IN_PROGRESS,
      title: COLUMN_TITLES[ColumnId.IN_PROGRESS],
      taskIds: [],
    },
    [ColumnId.DONE]: {
      id: ColumnId.DONE,
      title: COLUMN_TITLES[ColumnId.DONE],
      taskIds: [],
    },
  };

  return {
    tasks: {},
    columns: defaultColumns,
    columnOrder: [ColumnId.TODO, ColumnId.IN_PROGRESS, ColumnId.DONE],
  };
};

// Define actions and state for the Kanban board
interface KanbanStore extends BoardState {
  // Task operations
  addTask: (content: string) => string;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  
  // Task movement operations
  moveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    newIndex: number
  ) => { isFirstTimeInDone: boolean };
  
  reorderColumn: (
    columnId: string,
    startIndex: number,
    endIndex: number
  ) => void;
}

// Create the Kanban store with Zustand
export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      // Add a new task to the "To Do" column by default
      addTask: (content: string) => {
        const newTaskId = generateId();
        const timestamp = Date.now();

        set((state) => {
          // Create the new task with medium priority by default
          const newTask = {
            id: newTaskId,
            content,
            createdAt: timestamp,
            priority: TaskPriority.MEDIUM,
          };

          // Create a new tasks object with the new task
          const newTasks = {
            ...state.tasks,
            [newTaskId]: newTask,
          };

          // Update the "To Do" column to include the new task
          const todoColumn = state.columns[ColumnId.TODO];
          const updatedTodoColumn = {
            ...todoColumn,
            taskIds: [...todoColumn.taskIds, newTaskId],
          };

          // Return the updated state
          return {
            tasks: newTasks,
            columns: {
              ...state.columns,
              [ColumnId.TODO]: updatedTodoColumn,
            },
          };
        });

        return newTaskId;
      },

      // Update an existing task
      updateTask: (taskId: string, updates: Partial<Task>) => {
        set((state) => {
          // Skip if task doesn't exist
          if (!state.tasks[taskId]) return state;
          
          // Create updated task by merging current task with updates
          const updatedTask = {
            ...state.tasks[taskId],
            ...updates,
          };
          
          // Return updated state
          return {
            tasks: {
              ...state.tasks,
              [taskId]: updatedTask,
            },
          };
        });
      },

      // Delete a task from the board
      deleteTask: (taskId: string) => {
        set((state) => {
          // Create a new tasks object without the deleted task
          const { [taskId]: deletedTask, ...remainingTasks } = state.tasks;

          // Find which column contains the task and remove it
          const updatedColumns = { ...state.columns };
          
          Object.keys(updatedColumns).forEach((columnId) => {
            const column = updatedColumns[columnId];
            const taskIdIndex = column.taskIds.indexOf(taskId);
            
            if (taskIdIndex !== -1) {
              // If the task is in this column, remove it from the taskIds array
              updatedColumns[columnId] = {
                ...column,
                taskIds: column.taskIds.filter((id) => id !== taskId),
              };
            }
          });

          // Return the updated state
          return {
            tasks: remainingTasks,
            columns: updatedColumns,
          };
        });
      },

      // Move a task between columns or within the same column
      moveTask: (
        taskId: string,
        sourceColumnId: string,
        destinationColumnId: string,
        newIndex: number
      ) => {
        const result = { isFirstTimeInDone: false };

        set((state) => {
          // Get the source and destination columns
          const sourceColumn = state.columns[sourceColumnId];
          const destinationColumn = state.columns[destinationColumnId];

          // Trigger confetti animation whenever a task is moved to the Done column,
          // regardless of whether it's the first time or not
          if (destinationColumnId === ColumnId.DONE && sourceColumnId !== ColumnId.DONE) {
            // Always show confetti when moving to Done column
            result.isFirstTimeInDone = true;
          }

          // Create updated task IDs arrays
          const newSourceTaskIds = [...sourceColumn.taskIds];
          
          // Remove the task from the source column
          const [removedTaskId] = newSourceTaskIds.splice(
            newSourceTaskIds.indexOf(taskId),
            1
          );

          // If moving within the same column
          if (sourceColumnId === destinationColumnId) {
            // Add the task at the new index in the same column
            newSourceTaskIds.splice(newIndex, 0, removedTaskId);

            // Return updated state
            return {
              columns: {
                ...state.columns,
                [sourceColumnId]: {
                  ...sourceColumn,
                  taskIds: newSourceTaskIds,
                },
              },
            };
          } else {
            // If moving to a different column
            const newDestinationTaskIds = [...destinationColumn.taskIds];
            
            // Add the task at the new index in the destination column
            newDestinationTaskIds.splice(newIndex, 0, removedTaskId);

            // Return updated state with both columns changed
            return {
              columns: {
                ...state.columns,
                [sourceColumnId]: {
                  ...sourceColumn,
                  taskIds: newSourceTaskIds,
                },
                [destinationColumnId]: {
                  ...destinationColumn,
                  taskIds: newDestinationTaskIds,
                },
              },
            };
          }
        });

        return result;
      },

      // Reorder tasks within a column
      reorderColumn: (
        columnId: string,
        startIndex: number,
        endIndex: number
      ) => {
        set((state) => {
          const column = state.columns[columnId];
          const newTaskIds = [...column.taskIds];
          
          // Remove the task from the start index
          const [removed] = newTaskIds.splice(startIndex, 1);
          
          // Insert the task at the end index
          newTaskIds.splice(endIndex, 0, removed);

          // Return updated state
          return {
            columns: {
              ...state.columns,
              [columnId]: {
                ...column,
                taskIds: newTaskIds,
              },
            },
          };
        });
      },
    }),
    {
      name: 'zentask-kanban-storage', // LocalStorage key
    }
  )
);
