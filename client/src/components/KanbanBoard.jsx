import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn.jsx';

const KanbanBoard = ({ tasks, onDragEnd, onDeleteTask, onUpdateTask, members = [] }) => {
  const columns = {
    'To Do': {
      tasks: tasks.filter(task => task.status === 'To Do'),
      color: 'gray',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    'In Progress': {
      tasks: tasks.filter(task => task.status === 'In Progress'),
      color: 'blue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    'Done': {
      tasks: tasks.filter(task => task.status === 'Done'),
      color: 'green',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {Object.entries(columns).map(([title, { tasks, color, icon }]) => (
          <KanbanColumn 
            key={title} 
            title={title} 
            tasks={tasks}
            color={color}
            icon={icon}
            onDeleteTask={onDeleteTask}
            onUpdateTask={onUpdateTask}
            members={members}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;