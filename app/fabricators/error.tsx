'use client';

import RouteError from '../../components/ui/RouteError';

export default function FabricatorsError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteError {...props} label="the fabricators" />;
}
