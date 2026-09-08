import { Rocket, Zap } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 text-white">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing rings */}
        <div className="absolute w-32 h-32 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute w-24 h-24 border-b-4 border-cyan-400 rounded-full animate-[spin_2s_reverse_infinite]"></div>
        
        {/* Rocket Icon pulsing */}
        <Rocket className="w-10 h-10 text-white animate-pulse" />
      </div>
      
      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-2xl font-black uppercase tracking-widest bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Brewing Innovation
        </h2>
        <div className="flex items-center gap-2 mt-2 text-zinc-400 text-sm">
          <Zap className="w-4 h-4 text-yellow-400 animate-bounce" />
          <span>Fueling the startup engine...</span>
        </div>
      </div>
    </div>
  );
}
