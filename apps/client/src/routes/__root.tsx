import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { NavBar } from '@/components/general/NavBar';
import { Toaster } from '@/components/ui/toaster';

export const Route = createRootRoute({
  component: Root,
});

const queryClient = new QueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col w-full min-h-screen">
        <NavBar />
        <Outlet />
        <Toaster />
      </div>
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
