import { fetchManufacturers } from '../../lib/api';
import FabricatorListClient from '../../components/fabricator/FabricatorListClient';

export const revalidate = 600; // 10 minutes

export const metadata = {
  title: 'Fabricators | Manufacturer Database',
  description: 'Authorized hardware fabricators and corporate entities.',
};

export default async function FabricatorsPage() {
  let manufacturers: any[] = [];

  try {
      manufacturers = await fetchManufacturers();
  } catch (error) {
      console.warn('Build Warning: Failed to fetch manufacturers. Returning empty state.', error);
  }

  return <FabricatorListClient manufacturers={manufacturers} />;
}
