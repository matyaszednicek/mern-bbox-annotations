import { FullTask } from '@mbba/schema';
import { buildProvider } from './provider';

export const { Provider: ProvideTask, useRequireValue: useTask } =
  buildProvider<FullTask>('ProvideTask');
