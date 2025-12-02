
import { createClient } from '../../lib/supabase/server';
import TimelineClient from '../../components/TimelineClient';
import { TimelineEvent } from '../../lib/types';

export const metadata = {
  title: 'History Line | Video Game Timeline',
  description: 'An interactive timeline of video game history, tracking major console releases and industry-defining events.',
};

export default async function HistoryLinePage() {
  const supabase = await createClient();
  const { data } = await supabase.from('timeline').select('*').order('year', { ascending: true });
  
  // In case of error (e.g. table missing), return empty array
  const events: TimelineEvent[] = data || [];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
        <h2 className="text-3xl font-pixel text-center text-retro-pink mb-10 drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
            HISTORY LINE
        </h2>
        <TimelineClient events={events} />
    </div>
  );
}