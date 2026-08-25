'use client';

import RouteError from '../../components/ui/RouteError';

export default function BestOfError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteError {...props} label="this buying guide" />;
}
