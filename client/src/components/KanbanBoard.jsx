import React from 'react';
import KanbanColumn from './KanbanColumn';

const KanbanBoard = ({ tasks }) => {
  // Organize the tasks fetched from the API into columns
  const columns = {
    'To Do': tasks.filter(task => task.status === 'To Do'),
    'In Progress': tasks.filter(task => task.status === 'In Progress'),
    'Done': tasks.filter(task => task.status === 'Done'),
  };

  return (
    <div className="flex space-x-4 p-4 overflow-x-auto">
      <KanbanColumn title="To Do" tasks={columns['To Do']} />
      <KanbanColumn title="In Progress" tasks={columns['In Progress']} />
      <KanbanColumn title="Done" tasks={columns['Done']} />
    </div>
  );
};

export default KanbanBoard;