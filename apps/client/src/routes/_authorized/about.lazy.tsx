import { useUser } from '@/providers/useUser';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authorized/about')({
  component: About,
});

function About() {
  const user = useUser();
  return <div className="p-2">Hello from About! - {JSON.stringify(user)}</div>;
}
