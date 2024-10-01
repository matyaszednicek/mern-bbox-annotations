import { useLogoutMutation } from '@/hooks/mutations/useLogoutMutation';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authorized/profile')({
  component: Profile,
});

function Profile() {
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
