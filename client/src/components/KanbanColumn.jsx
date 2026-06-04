import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const KanbanColumn = ({ title, tasks, color, icon, onDeleteTask, onUpdateTask, members = [] }) => {
  const colorClasses = {
    gray: {
      badge: 'bg-paper/60 text-muted',
      dot: 'bg-line'
    },
    blue: {
      badge: 'bg-accent/10 text-accent',
      dot: 'bg-accent'
    },
    green: {
      badge: 'bg-accent-2/10 text-accent-2',
      dot: 'bg-accent-2'
    },
  };

  const colors = colorClasses[color] || colorClasses.gray;

  return (
    <div className={`card p-4 min-w-[320px] flex-shrink-0 border ${'border-line'}`} style={{ borderRadius: 16 }}>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`${colors.dot} w-3 h-3 rounded-full`}></div>
          <h3 className="font-semibold text-base text-ink">{title}</h3>
          <span className={`${colors.badge} px-2 py-0.5 rounded-full text-xs font-medium`}>
            {tasks.length}
          </span>
        </div>
        <div className="text-muted">
          {icon}
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={title}>
        {(provided, snapshot) => (
          <div 
            ref={provided.innerRef} 
            {...provided.droppableProps} 
            className={`min-h-[200px] space-y-3 transition-all rounded-md p-3 ${
              snapshot.isDraggingOver ? 'bg-accent/5 ring-1 ring-accent/30' : ''
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
              <div className="flex flex-col items-center justify-center py-8 text-muted">
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