// client/src/components/KanbanColumn.jsx

import React from 'react';
import TaskCard from './TaskCard';

const KanbanColumn = ({ title, tasks }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-3 w-80 flex-shrink-0">
      <h3 className="font-bold text-lg mb-4 text-gray-700">{title}</h3>
      <div>
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;