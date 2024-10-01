import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';
import {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form';

interface FormFieldComponentProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  component: (field: ControllerRenderProps<T, Path<T>>) => React.ReactNode;
}

const FormFieldComponent = <T extends FieldValues>({
  control,
  name,
  label,
  component,
}: FormFieldComponentProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>{component(field)}</FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormFieldComponent;
