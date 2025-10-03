import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const KanbanColumn = ({ title, tasks }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-3 w-80 flex-shrink-0">
      <h3 className="font-bold text-lg mb-4 text-gray-700">{title}</h3>
      <Droppable droppableId={title}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[100px]">
            {tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;