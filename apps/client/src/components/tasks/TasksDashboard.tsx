import React from 'react';
import { Link } from '@tanstack/react-router';
import { Task } from '@mbba/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AddTaskDialog from '../dialog/AddTaskDialog';

type TaskCardProps = {
  task: Task;
};

const TaskCard: React.FC<TaskCardProps> = React.memo(({ task }) => (
  <Link to="/tasks/$taskId" params={{ taskId: task._id }}>
    <Card className="flex flex-col items-center justify-between px-4 text-gray-900 min-w-80 ">
      <CardHeader className="w-full text-center">
        <CardTitle className="text-xl font-bold">{task.name}</CardTitle>
      </CardHeader>
      <div className="flex items-center justify-center w-full h-40 mb-4 overflow-hidden bg-gray-100 rounded-lg">
        {/* {task.image ? (// TODO: Add image to task schema
        <img
        src={task.image}
        alt={task.name}
        className="object-cover w-full h-full"
        />
        ) : ( */}
        <div className="text-gray-500">No Preview Available</div>
        {/* )} */}
      </div>
      <CardContent className="w-full space-y-2">
        <div className="flex flex-wrap justify-center gap-2">
          {task.labels.map((label) => (
            <Badge key={label} variant="secondary">
              {label}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  </Link>
));

type TasksDashboardProps = {
  tasks?: Task[];
};

const TasksDashboard: React.FC<TasksDashboardProps> = ({ tasks = [] }) => {
  return (
    <div className="container text-gray-900">
      <h1 className="mb-8 text-3xl font-bold text-center">Your Tasks</h1>
      <div className="flex justify-center mb-8">
        <AddTaskDialog />
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks found.</p>
      ) : null}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 ">
        {tasks
          .slice()
          .reverse()
          .map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
      </div>
    </div>
  );
};

export default TasksDashboard;
