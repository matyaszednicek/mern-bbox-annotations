import { User } from '@mbba/schema';
import { buildProvider } from './provider';

export const { Provider: ProvideUser, useRequireValue: useUser } =
  buildProvider<{
    user: User;
  }>('ProvideUser');
