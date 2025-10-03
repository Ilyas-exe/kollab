import React from 'react';

const TaskCard = ({ task }) => {
  return (
    <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200 mb-2">
      <p className="font-semibold text-gray-800">{task.title}</p>
    </div>
  );
};

export default TaskCard;