import { getSystemVersion } from '../actions/roadmap';
import ArenaComparisonClient from '../../components/arena/ArenaComparisonClient';

export default async function ArenaPage() {
  const version = await getSystemVersion();
  return <ArenaComparisonClient version={version} />;
}
