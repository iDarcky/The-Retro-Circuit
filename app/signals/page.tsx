import { fetchRetroNews, fetchConsoleList, fetchGameList } from '../../lib/api';
import SignalFeedClient from '../../components/SignalFeedClient';

export const metadata = {
  title: 'Signal Feed | Retro Gaming News',
  description: 'Latest updates from the retro gaming world, including hardware announcements, software releases, and community news.',
};

export default async function SignalFeedPage() {
  const [newsData, consoleList, gameList] = await Promise.all([
    fetchRetroNews(1, 10),
    fetchConsoleList(),
    fetchGameList()
  ]);

  const referenceData = {
    consoles: consoleList,
    games: gameList
  };

  return (
    <SignalFeedClient 
      initialNews={newsData.data} 
      initialCount={newsData.count} 
      referenceData={referenceData} 
    />
  );
}