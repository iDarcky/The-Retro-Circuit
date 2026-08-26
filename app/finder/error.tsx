'use client';

import RouteError from '../../components/ui/RouteError';

export default function FinderError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteError {...props} label="the finder" />;
}
