import { User } from '@app/shared/interfaces';

declare module '*.json' {
  const value: any;
  export default value;
}

declare global {
  interface Window {
    user: User | null;
  }
}
