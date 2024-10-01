import FullPageLoader from '@/components/general/FullPageLoader';
import { useUserQuery } from '@/hooks/queries/useUserQuery';
import { ProvideUser } from '@/providers/useUser';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_authorized')({
  component: AuthorizedRouteWrapper,
});

function AuthorizedRouteWrapper() {
  const { data: user, isLoading, error } = useUserQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (error) {
    navigate({ to: '/login' });
    return null;
  }

  return (
    <ProvideUser value={user}>
      <Outlet />
    </ProvideUser>
  );
}
