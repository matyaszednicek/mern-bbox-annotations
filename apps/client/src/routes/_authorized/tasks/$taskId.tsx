import FullPageLoader from '@/components/general/FullPageLoader';
import { useTaskQuery } from '@/hooks/queries/useTaskQuery';
import { ProvideTask } from '@/providers/useTask';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authorized/tasks/$taskId')({
  component: TaskPage,
});

function TaskPage() {
  const { taskId } = Route.useParams();
  const { data: task, isLoading, error } = useTaskQuery(taskId);

  if (isLoading) {
    return <FullPageLoader />;
  }
  if (error || !task) {
    return <div>Something went wrong!</div>;
  }

  return (
    <ProvideTask value={task}>
      <Outlet />
    </ProvideTask>
  );
}
