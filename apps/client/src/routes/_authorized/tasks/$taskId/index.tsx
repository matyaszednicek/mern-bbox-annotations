import TaskImagesDashboard from '@/components/tasks/TaskImagesDashboard'
import { useTask } from '@/providers/useTask'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authorized/tasks/$taskId/')({
  component: TaskPage,
})

function TaskPage() {
  const { name } = useTask()
  return (
    <div className="container text-gray-900">
      <h1 className="mb-8 text-3xl font-bold text-center">{name}</h1>
      <TaskImagesDashboard />
    </div>
  )
}
