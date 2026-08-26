'use client';

import RouteError from '../../components/ui/RouteError';

export default function ArenaError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteError {...props} label="the arena" />;
}
