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
          <p className="font-semibold text-gray-800 mb-2">{task.title}</p>
          {/* --- THIS IS THE CHANGE --- */}
          {task.assigneeId && (
            <div className="text-sm text-gray-500 mt-2">
              Assigned to: {task.assigneeId.name}
            </div>
          )}
          {/* --- END OF CHANGE --- */}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;