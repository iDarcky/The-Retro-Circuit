export const revalidate = 60;

import Gameboy from '../components/ui/Gameboy';

export default async function ControlRoomPage() {
  return (
    <div className="w-full h-full min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-retro-dark">
        <Gameboy />
    </div>
  );
}
