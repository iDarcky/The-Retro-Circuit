import { fetchManufacturers } from '../../app/actions';
import FabricatorListClient from '../../components/fabricator/FabricatorListClient';

export const revalidate = false;

export const metadata = {
  title: { absolute: 'Retro Handheld Manufacturers & Brands | The Retro Circuit' },
  description: 'Browse all retro handheld manufacturers and modders. Explore their full device catalogues and specs.',
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
