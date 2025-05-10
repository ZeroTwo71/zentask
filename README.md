# ZenTask: Modern Kanban Task Tracker

ZenTask is a minimalist yet powerful Kanban board application for tracking your daily tasks. Built with modern web technologies, it provides an intuitive and responsive interface for managing tasks across different stages of completion.

## Features

- **Modern Kanban Board**: Organize tasks in three columns - "To Do", "In Progress", and "Done".
- **Drag and Drop**: Intuitively move tasks between columns or reorder them within a column.
- **Task Management**: Easily add new tasks, delete existing ones, and track progress.
- **Confetti Celebration**: Enjoy a confetti animation when tasks are completed.
- **Dark/Light Theme**: Toggle between light and dark modes for comfortable viewing in any environment.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.
- **Persistence**: All your tasks are automatically saved to your browser's local storage.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Drag and Drop**: [dnd-kit](https://dndkit.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [react-confetti](https://www.npmjs.com/package/react-confetti)
- **Theme Switching**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/`: Contains Next.js App Router pages and layouts
- `components/`: React components
  - `kanban/`: Kanban-specific components
  - `shared/`: Shared utility components
  - `ui/`: shadcn/ui components
- `hooks/`: Custom React hooks
- `lib/`: Utility functions and TypeScript types
- `store/`: Zustand state management

## Usage

1. **Adding Tasks**: Type your task in the input field at the top and click "Add Task".
2. **Moving Tasks**: Drag and drop tasks between columns to update their status.
3. **Reordering Tasks**: Drag tasks within a column to change their order.
4. **Deleting Tasks**: Click the trash icon on a task card to delete it.
5. **Switching Themes**: Click the theme toggle in the top-right corner to switch between light and dark modes.

## License

MIT
