'use client';

import RouteError from '../../../components/ui/RouteError';

export default function ConsoleDetailError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteError {...props} label="this console" />;
}
