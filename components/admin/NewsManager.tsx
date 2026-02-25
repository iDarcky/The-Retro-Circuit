'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NewsItem, NewsCategory } from '@/lib/types/news';
import { createNews, deleteNews } from '@/app/actions/news';
import { SwissDropdown } from '../ui/SwissDropdown';

interface NewsManagerProps {
  news: NewsItem[];
}

export const NewsManager: React.FC<NewsManagerProps> = ({ news }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: 'announcement' as NewsCategory,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createNews({
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        image_url: formData.image_url,
        category: formData.category,
      });

      setFormData({
        title: '',
        excerpt: '',
        content: '',
        image_url: '',
        category: 'announcement',
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to create news:', error);
      alert('Failed to publish news.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await deleteNews(id);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete news:', error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">

      {/* Create Form */}
      <div className="bg-black/80 border border-white/10 p-6">
        <h2 className="text-xl font-pixel text-violet-500 mb-6 flex items-center gap-2">
           <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
           PUBLISH NEWS
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                   <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Article Title</label>
                   <input
                     type="text"
                     name="title"
                     value={formData.title}
                     onChange={handleChange}
                     className="w-full bg-black border border-white/20 p-3 text-sm font-mono text-white placeholder:text-gray-700 focus:border-violet-500 focus:outline-none"
                     placeholder="> ENTER_HEADLINE..."
                     required
                   />
               </div>

               <div>
                   <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Category</label>
                   <SwissDropdown
                     value={formData.category}
                     onChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                     options={[
                       { label: 'ANNOUNCEMENT', value: 'announcement' },
                       { label: 'RUMOR', value: 'rumor' },
                       { label: 'RELEASE', value: 'release' },
                       { label: 'GUIDE', value: 'guide' }
                     ]}
                     labelPrefix="" inverted={false}
                     className="w-full"
                     buttonClassName="bg-black border border-white/20 p-3 text-sm font-mono text-white focus:border-violet-500 focus:outline-none h-[46px] flex justify-between items-center"
                   />
               </div>
           </div>

           <div>
             <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Excerpt (Short Summary)</label>
             <textarea
               name="excerpt"
               value={formData.excerpt}
               onChange={handleChange}
               className="w-full bg-black border border-white/20 p-3 text-sm font-mono text-white placeholder:text-gray-700 focus:border-violet-500 focus:outline-none h-20"
               placeholder="> ENTER_SUMMARY..."
               required
               maxLength={300}
             />
           </div>

           <div>
             <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Full Content (Markdown Supported)</label>
             <textarea
               name="content"
               value={formData.content}
               onChange={handleChange}
               className="w-full bg-black border border-white/20 p-3 text-sm font-mono text-white placeholder:text-gray-700 focus:border-violet-500 focus:outline-none h-64"
               placeholder="> ENTER_CONTENT..."
             />
           </div>

           <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-violet-600 hover:bg-violet-500 text-black font-bold uppercase text-xs px-8 py-3 transition-colors disabled:opacity-50"
                >
                 {isLoading ? 'PUBLISHING...' : 'PUBLISH ARTICLE'}
               </button>
           </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-black/40 border border-white/5 p-6">
        <h3 className="text-sm font-mono text-gray-500 uppercase mb-4">Recent Articles</h3>

        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="flex items-start justify-between p-4 border border-white/10 bg-black/20 hover:border-violet-500/30 transition-colors">
              <div className="flex-1">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono text-violet-500 border border-violet-500/30 px-2 py-0.5 uppercase">
                       {item.category}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                       {new Date(item.published_at).toLocaleDateString()}
                    </span>
                 </div>
                 <h4 className="font-bold text-white mb-1">{item.title}</h4>
                 <p className="font-mono text-xs text-gray-400 line-clamp-1">
                    {item.excerpt}
                 </p>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="ml-4 text-[10px] text-red-500 hover:text-red-400 uppercase font-bold border border-red-500/30 hover:bg-red-950/30 px-3 py-1 transition-colors"
              >
                DELETE
              </button>
            </div>
          ))}

           {news.length === 0 && (
            <div className="text-center py-8 text-gray-600 font-mono text-xs">
               NO_ARTICLES_FOUND
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
