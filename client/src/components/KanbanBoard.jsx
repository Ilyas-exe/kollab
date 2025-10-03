import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn.jsx';

const KanbanBoard = ({ tasks, onDragEnd }) => {
  const columns = {
    'To Do': tasks.filter(task => task.status === 'To Do'),
    'In Progress': tasks.filter(task => task.status === 'In Progress'),
    'Done': tasks.filter(task => task.status === 'Done'),
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 p-4 overflow-x-auto bg-gray-200 rounded-lg">
        {Object.entries(columns).map(([title, tasks]) => (
          <KanbanColumn key={title} title={title} tasks={tasks} />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;