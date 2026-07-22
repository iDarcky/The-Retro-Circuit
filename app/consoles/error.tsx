'use client';

import RouteError from '../../components/ui/RouteError';

export default function ConsolesError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteError {...props} label="the console vault" />;
}
