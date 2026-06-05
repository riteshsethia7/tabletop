import { ReactNode } from 'react';
import { HelmetProvider as ReactHelmetProvider } from 'react-helmet-async';

interface HelmetProviderProps {
  children: ReactNode;
}

export function HelmetProvider({ children }: HelmetProviderProps) {
  return <ReactHelmetProvider>{children}</ReactHelmetProvider>;
}
