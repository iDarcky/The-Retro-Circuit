import { ReviewManager } from '@/components/admin/ReviewManager';
import { fetchAllReviews } from '@/app/actions/reviews';
import { fetchConsoleList } from '@/app/actions/consoles';

export default async function ReviewsPage() {
  const reviews = await fetchAllReviews();
  const consoles = await fetchConsoleList();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8 px-6 pt-6">
        <h1 className="text-2xl font-pixel text-text-primary">HARDWARE ANALYSIS</h1>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-500">
           <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
           DATABASE_LINKED
        </div>
      </div>

      <ReviewManager reviews={reviews} consoles={consoles} />
    </div>
  );
}
