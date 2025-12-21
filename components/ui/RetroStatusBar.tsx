import { siteConfig } from '../../config/site';

interface RetroStatusBarProps {
  rcPath: string;
  docId: string;
  status?: string;
  archiveVersion?: string;
}

export default function RetroStatusBar({
  rcPath,
  docId,
  status = 'ONLINE',
  archiveVersion = siteConfig.version
}: RetroStatusBarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 md:px-8 mt-4 md:mt-8 mb-4">
      {/* Left: Label */}
      <div className="text-sm font-bold text-gray-500 font-mono tracking-widest uppercase">
        {rcPath}
      </div>

      {/* Right: Metadata Stats */}
      <div className="flex flex-row items-center gap-6 text-gray-500 font-tech tracking-wider uppercase text-[12px] font-bold mt-2 md:mt-0">
        <div className="flex items-center">
          STATUS: {status}
        </div>
        <div>
          ARCHIVE: {archiveVersion}
        </div>
        <div className="font-mono text-[10px] text-gray-600 border border-gray-700 px-2 py-1">
          DOC_ID: {docId}
        </div>
      </div>
    </div>
  );
}
