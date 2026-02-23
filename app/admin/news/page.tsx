import { NewsManager } from '@/components/admin/NewsManager';
import { fetchAllNews } from '@/app/actions/news';

export default async function AdminNewsPage() {
  const news = await fetchAllNews();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8 px-6 pt-6">
        <h1 className="text-2xl font-pixel text-white">PRESS CENTER</h1>
        <div className="flex items-center gap-2 text-xs font-mono text-violet-500">
           <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse"></span>
           UPLINK_ESTABLISHED
        </div>
      </div>

      <NewsManager news={news} />
    </div>
  );
}
