export const revalidate = 60;

import Gameboy from '../components/ui/Gameboy';

export default async function ControlRoomPage() {
  return (
    <div className="w-full h-full min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-retro-dark overflow-hidden">
        {/* CRT Overlay Effect just for this area if needed, but Global layout has it */}
        <div className="scale-[0.6] md:scale-[0.8] lg:scale-100 transition-transform duration-500">
           <Gameboy />
        </div>
    </div>
  );
}
