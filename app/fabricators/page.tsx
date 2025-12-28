import { fetchManufacturers } from '../../lib/api';
import FabricatorListClient from '../../components/fabricator/FabricatorListClient';

export const revalidate = 60;

export const metadata = {
  title: 'Fabricators | Manufacturer Database',
  description: 'Authorized hardware fabricators and corporate entities.',
};

export default async function FabricatorsPage() {
  const manufacturers = await fetchManufacturers();

  return <FabricatorListClient manufacturers={manufacturers} />;
}
