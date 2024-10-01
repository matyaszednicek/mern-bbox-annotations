import FullPageLoader from '@/components/general/FullPageLoader';
import TasksDashboard from '@/components/tasks/TasksDashboard';
import { useTasksQuery } from '@/hooks/queries/useTasksQuery';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authorized/')({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: tasks, isLoading, error } = useTasksQuery();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (error) {
    return <div className="container">There was an error</div>;
  }

  return <TasksDashboard tasks={tasks} />;
}
