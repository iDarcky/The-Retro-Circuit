'use client';

import RouteError from '../../components/ui/RouteError';

export default function NewsError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteError {...props} label="the transmission feed" />;
}
