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
import { useRegisterForm } from '@/hooks/forms/useRegisterForm';

export default function RegisterForm() {
  const { form, onSubmit, disableSubmit, isSuccess } = useRegisterForm();

  if (isSuccess) {
    return <Navigate to="/login" />;
  }

  return (
    <Card className="w-full max-w-sm mx-auto mt-20">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Register</CardTitle>
        <CardDescription>
          Fill out the form below to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormFieldComponent
              control={form.control}
              name="username"
              label="Username"
              component={(field) => (
                <Input type="text" placeholder="jondoe" required {...field} />
              )}
            />
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
            <FormFieldComponent
              control={form.control}
              name="passwordAgain"
              label="Confirm Password"
              component={(field) => (
                <Input type="password" required {...field} />
              )}
            />
            <div className="flex flex-col justify-center space-y-2">
              <Button type="submit" className="w-full" disabled={disableSubmit}>
                Register
              </Button>
              <Link className="self-center text-sm hover:underline" to="/login">
                Already have an account?
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
