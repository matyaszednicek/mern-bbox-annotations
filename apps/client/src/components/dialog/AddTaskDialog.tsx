import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFieldArray, useForm } from 'react-hook-form';
import { Form } from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldComponent from '../form/FormFieldComponent';
import { z } from 'zod';
import { useAddTaskMutation } from '@/hooks/mutations/useAddTaskMutation';
import { useQueryClient } from '@tanstack/react-query';

export const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least three characters'),
  labels: z
    .array(
      z.object({
        value: z
          .string()
          .regex(
            /^[a-zA-Z0-9]+$/,
            'Labels can only contain letters and numbers'
          ),
      })
    )
    .min(1, 'At least one label is required'),
});
export type FormValues = z.infer<typeof formSchema>;

const AddTaskDialog: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const addTaskMutation = useAddTaskMutation();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      labels: [{ value: '' }],
    },
  });
  const isDisabled = submitting || !form.formState.isValid;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'labels',
  });

  const onSubmit = React.useCallback(
    (data: FormValues) => {
      setSubmitting(true);
      const name = data.name.trim();
      const labels = data.labels
        .map((label) => label.value.trim())
        .filter((label) => label.length > 0);

      if (name.length < 3) {
        form.setError('name', {
          message: 'Name must be at least three characters',
        });
        return;
      }
      if (labels.length < 1) {
        form.setError('root', { message: 'At least one label is required' });
        return;
      }

      addTaskMutation.mutate(
        { name, labels },
        {
          onSuccess: () => {
            form.reset();
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
          },
        }
      );
    },
    [form, addTaskMutation, queryClient]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormFieldComponent
              control={form.control}
              name="name"
              label="Task Name"
              component={() => (
                <Input
                  type="text"
                  placeholder="Enter task name"
                  required
                  {...form.register('name')}
                />
              )}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium ">
                Labels (only letters and numbers allowed)
              </label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex space-x-2">
                  <Input
                    {...form.register(`labels.${index}.value`)}
                    placeholder={`Label ${index + 1}`}
                    required
                    pattern="^[a-zA-Z0-9]+$"
                  />
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    variant="ghost"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => append({ value: '' })}
                disabled={fields.length > 4}
              >
                Add Label
              </Button>
            </div>

            {form.formState.errors.root && (
              <p className="text-red-500">
                {form.formState.errors.root.message}
              </p>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isDisabled}>
                {submitting ? 'Saving Task' : 'Save Task'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
