import { Link, Navigate } from '@tanstack/react-router';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '../ui/form';
import FormFieldComponent from '../form/FormFieldComponent';
import { Input } from '../ui/input';
import { useLoginForm } from '@/hooks/forms/useLoginForm';

export default function LoginForm() {
  const { form, onSubmit, disableSubmit, isSuccess } = useLoginForm();

  if (isSuccess) {
    return <Navigate to="/" />;
  }

  return (
    <Card className="w-full max-w-sm mx-auto mt-20">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Fill out the form below to login</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormFieldComponent
              control={form.control}
              name="email"
              label="Email"
              component={(field) => (
                <Input
                  type="email"
                  placeholder="jon@example.com"
                  required
                  {...field}
                />
              )}
            />
            <FormFieldComponent
              control={form.control}
              name="password"
              label="Password"
              component={(field) => (
                <Input type="password" required {...field} />
              )}
            />
            <div className="flex flex-col justify-center space-y-2">
              <Button type="submit" className="w-full" disabled={disableSubmit}>
                Login
              </Button>
              <Link
                className="self-center text-sm hover:underline"
                to="/register"
              >
                Don't have an account yet?
              </Link>
              {form.formState.errors.root && (
                <p className="text-red-500">
                  {form.formState.errors.root.message}
                </p>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
