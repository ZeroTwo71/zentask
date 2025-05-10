// Define TaskPriority enum
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

// Define the Task type
export type Task = {
  id: string;
  content: string;
  createdAt: number;
  priority: TaskPriority;
  description?: string;
};

// Define the Column type
export type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

// Define the overall board state type
export type BoardState = {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
};

// Define the ID of the default columns
export enum ColumnId {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

// Define the default column titles
export const COLUMN_TITLES: Record<ColumnId, string> = {
  [ColumnId.TODO]: 'To Do',
  [ColumnId.IN_PROGRESS]: 'In Progress',
  [ColumnId.DONE]: 'Done',
};
