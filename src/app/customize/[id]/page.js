import { listings } from '../../data';
import { notFound } from 'next/navigation';
import CustomizeForm from '../../../components/CustomizeForm';

// Generate static params for all listings
export async function generateStaticParams() {
  return listings.map((listing) => ({
    id: listing.id.toString(),
  }));
}

export default async function CustomizePage({ params }) {
  const { id } = await params;
  const listing = listings.find((l) => l.id.toString() === id);

  if (!listing) {
    notFound();
  }

  return <CustomizeForm listing={listing} />;
}
