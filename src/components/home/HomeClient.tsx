'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket, Zap, Users, ArrowRight, Activity, CalendarDays } from 'lucide-react';

export default function HomeClient({ session, room, occupancySlots, formattedDate, prevDate, nextDate }: any) {
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none" />

      <header className="bg-[#09090B]/80 backdrop-blur-xl border-b border-zinc-800/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-xl text-white tracking-tight leading-none">THE FOUNDRY</h1>
              <p className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase mt-1">R&D Incubator</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            {session?.user ? (
              <Link href={session.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}>
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6 font-bold tracking-wide shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all hover:scale-105">
                  Launch Console
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full px-6 transition-all hover:scale-105">
                  Founder Login
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12 relative z-10 flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        
        {/* Left Side: Intro & Date Selector */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/3 flex flex-col gap-8 sticky top-28"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Fuel Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Next Big Idea</span>
            </h2>
            <p className="mt-4 text-zinc-400 text-lg">
              Check live capacity and claim your sprint slots in The Foundry. Hard cap at 21 innovators.
            </p>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <CalendarDays className="text-cyan-400 w-6 h-6" />
              <h3 className="font-bold text-lg">Timeline</h3>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center bg-zinc-950 rounded-full p-2 border border-zinc-800">
                <Link href={`/?date=${prevDate}`}>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-800 text-zinc-400">&larr;</Button>
                </Link>
                <span className="font-bold text-sm tracking-wide text-white">{formattedDate}</span>
                <Link href={`/?date=${nextDate}`}>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-800 text-zinc-400">&rarr;</Button>
                </Link>
              </div>

              <div className="flex items-center justify-between px-4 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                <span className="text-zinc-400 text-sm font-medium">Max Capacity</span>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span className="font-black text-indigo-400">{room?.capacity || 21}</span>
                </div>
              </div>
            </div>
          </div>

          {!session?.user && (
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-3xl border border-zinc-800 text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">EDIC Member?</h3>
              <p className="text-sm text-zinc-500 mb-6">Log in to book your launch slot and start building.</p>
              <Link href="/login" className="w-full">
                <Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-full font-bold">Log In to Book</Button>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Right Side: Timeline */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2 px-2">
            <Activity className="text-indigo-400 w-5 h-5 animate-pulse" />
            <h3 className="font-bold text-zinc-300 tracking-wider uppercase text-sm">Live Availability</h3>
          </div>

          {occupancySlots.length > 0 ? (
            <div className="space-y-3">
              {occupancySlots.map((slot: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={i} 
                  className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.02] ${slot.isFull ? 'bg-red-500/5 border-red-500/20' : 'bg-zinc-900 border-zinc-800 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]'}`}
                >
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="w-32 font-mono font-bold text-zinc-300">
                      {slot.startTime} <span className="text-zinc-600">-</span> {slot.endTime}
                    </div>
                    
                    <div className="flex-1 max-w-sm w-full">
                      <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (slot.occupancy / slot.capacity) * 100)}%` }}
                          transition={{ duration: 1, delay: i * 0.05 + 0.2 }}
                          className={`h-full ${slot.isFull ? 'bg-red-500' : slot.occupancy > 0 ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' : 'bg-zinc-700'}`}
                        />
                      </div>
                    </div>

                    <div className="w-36 text-right sm:text-left flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                      {slot.isFull ? (
                        <span className="text-red-400 font-black text-sm tracking-widest uppercase">
                          MAXED OUT
                        </span>
                      ) : (
                        <>
                          <span className="text-sm font-black text-white">{slot.available} Slots Open</span>
                          <span className="text-xs font-bold text-zinc-500">{slot.occupancy}/{slot.capacity} Active</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Hover gradient effect inside card */}
                  {!slot.isFull && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-cyan-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/50">
              <p className="text-zinc-500 font-medium">No telemetry data found for this cycle.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
