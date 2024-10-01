import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ErrorComponent: React.FC<{ error: Error }> = ({ error }) => {
  return (
    <Alert variant="destructive" className="mx-auto w-96">
      <ExclamationTriangleIcon className="w-4 h-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong. Please try again later.
      </AlertDescription>
    </Alert>
  );
};

export default ErrorComponent;
