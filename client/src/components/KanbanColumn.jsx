import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const KanbanColumn = ({ title, tasks, color, icon, onDeleteTask, onUpdateTask, members = [] }) => {
  const colorClasses = {
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      badge: 'bg-gray-100 text-gray-700',
      dot: 'bg-gray-400'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-700',
      dot: 'bg-blue-500'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      badge: 'bg-green-100 text-green-700',
      dot: 'bg-green-500'
    },
  };

  const colors = colorClasses[color] || colorClasses.gray;

  return (
    <div className={`${colors.bg} rounded-xl p-4 min-w-[320px] flex-shrink-0 border-2 ${colors.border}`}>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`${colors.dot} w-2 h-2 rounded-full`}></div>
          <h3 className="font-bold text-base text-text-primary">{title}</h3>
          <span className={`${colors.badge} px-2 py-0.5 rounded-full text-xs font-semibold`}>
            {tasks.length}
          </span>
        </div>
        <div className="text-text-secondary">
          {icon}
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={title}>
        {(provided, snapshot) => (
          <div 
            ref={provided.innerRef} 
            {...provided.droppableProps} 
            className={`min-h-[200px] space-y-3 transition-colors rounded-lg p-2 ${
              snapshot.isDraggingOver ? 'bg-white bg-opacity-50' : ''
            }`}
          >
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  index={index} 
                  onDelete={onDeleteTask}
                  onUpdate={onUpdateTask}
                  members={members}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-text-secondary">
                <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-sm">No tasks</p>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;