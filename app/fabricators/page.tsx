import { fetchManufacturers } from '../../lib/api';
import FabricatorListClient from '../../components/fabricator/FabricatorListClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Fabricators | Manufacturer Database',
  description: 'Authorized hardware fabricators and corporate entities.',
};

export default async function FabricatorsPage() {
  const manufacturers = await fetchManufacturers();

  return <FabricatorListClient manufacturers={manufacturers} />;
}
