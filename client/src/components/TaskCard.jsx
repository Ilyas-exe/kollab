import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

const TaskCard = ({ task, index }) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-3 rounded-md shadow-sm border border-gray-200 mb-2"
        >
          <p className="font-semibold text-gray-800">{task.title}</p>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;