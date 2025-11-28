
import { type FC } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound: FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="font-pixel text-6xl text-retro-pink mb-4 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] animate-pulse">
        404
      </div>
      <h2 className="font-pixel text-2xl text-white mb-6">SIGNAL LOST</h2>
      <p className="font-mono text-gray-400 max-w-md mb-8 leading-relaxed">
        The frequency you are trying to access does not exist or has been moved to a new sector.
      </p>
      
      <div className="p-6 border border-retro-grid bg-retro-dark mb-8 w-full max-w-md">
        <div className="text-xs font-mono text-retro-blue mb-2 text-left">SUGGESTED VECTORS:</div>
        <ul className="text-sm font-mono text-gray-300 space-y-2 text-left">
            <li>• Check if the URL is correct (case-sensitive).</li>
            <li>• The archives may have been reorganized.</li>
        </ul>
      </div>

      <Link to="/">
        <Button variant="primary">RETURN TO DASHBOARD</Button>
      </Link>
    </div>
  );
};

export default NotFound;
