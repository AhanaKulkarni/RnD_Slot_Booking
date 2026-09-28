'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket, Zap, Users, Activity, CalendarDays } from 'lucide-react';

export default function HomeClient({ session, room, occupancySlots, formattedDate, prevDate, nextDate }: any) {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-zinc-100 flex flex-col selection:bg-cyan-500/30 font-sans relative overflow-x-hidden">
      
      {/* Background Gradient matching the image */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#1A183A] via-[#0B0C10] to-[#0B0C10] pointer-events-none" />

      <header className="relative z-50 pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#4F8BFF] flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-serif font-bold text-xl text-white tracking-wide leading-tight">THE FOUNDRY</h1>
              <p className="text-[10px] text-[#4F8BFF] font-bold tracking-widest uppercase">R&D INCUBATOR</p>
            </div>
          </div>
          
          <div>
            {session?.user ? (
              <Link href={session.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}>
                <Button className="bg-white text-black rounded-full px-8 py-2.5 h-auto font-medium hover:bg-zinc-200 transition-all">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="bg-white text-black rounded-full px-8 py-2.5 h-auto font-medium hover:bg-zinc-200 transition-all">
                  Founder Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 relative z-10 flex flex-col md:flex-row gap-12 lg:gap-20 items-start">
        
        {/* Left Side: Intro & Cards */}
        <div className="w-full md:w-[40%] flex flex-col gap-10 sticky top-12">
          <div className="pt-4">
            <h2 className="text-[3.5rem] leading-[1.1] font-serif font-bold text-white mb-2">
              Fuel Your <br />
              <span className="text-[#6495ED]">Next Big Idea</span>
            </h2>
            <p className="mt-6 text-zinc-400 text-base leading-relaxed max-w-[85%] font-serif">
              Check live capacity and claim your sprint slots in The Foundry. Hard cap at 21 innovators.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Timeline Card */}
            <div className="bg-[#16161E] rounded-3xl p-6 shadow-2xl border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <CalendarDays className="text-[#4F8BFF] w-5 h-5" />
                <h3 className="font-bold text-white font-serif tracking-wide text-lg">Timeline</h3>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center bg-[#0B0C10] rounded-full px-4 py-3 border border-white/5">
                  <Link href={`/?date=${prevDate}`} className="text-zinc-500 hover:text-white transition-colors">
                    &larr;
                  </Link>
                  <span className="font-bold text-sm text-white">{formattedDate}</span>
                  <Link href={`/?date=${nextDate}`} className="text-zinc-500 hover:text-white transition-colors">
                    &rarr;
                  </Link>
                </div>

                <div className="flex items-center justify-between px-5 py-4 bg-[#1E1E28] rounded-2xl border border-white/5 mt-2">
                  <span className="text-zinc-400 text-sm">Max Capacity</span>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#4F8BFF]" />
                    <span className="font-bold text-white">{room?.capacity || 21}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* EDIC Member Card */}
            {!session?.user && (
              <div className="bg-[#16161E] p-8 rounded-3xl border border-white/5 text-center shadow-2xl">
                <Zap className="w-8 h-8 text-[#FFD700] mx-auto mb-4" />
                <h3 className="text-white font-bold font-serif text-xl mb-3">EDIC Member?</h3>
                <p className="text-sm text-zinc-400 mb-8 font-serif px-4">
                  Log in to book your launch slot and start building.
                </p>
                <Link href="/login" className="block w-full">
                  <Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-full font-bold py-6 text-base">
                    Log In To Book
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Timeline Slots */}
        <div className="w-full md:w-[60%] flex flex-col gap-6 pt-4">
          <div className="flex items-center gap-3 mb-2 px-2">
            <Activity className="text-[#4F8BFF] w-5 h-5" />
            <h3 className="font-bold text-white tracking-widest uppercase text-sm font-serif">LIVE AVAILABILITY</h3>
          </div>

          {occupancySlots.length > 0 ? (
            <div className="flex flex-col gap-4">
              {occupancySlots.map((slot: any, i: number) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between bg-[#1A1A24] rounded-2xl px-6 py-5 border border-white/5 hover:bg-[#1E1E2A] transition-colors"
                >
                  <div className="font-black text-white w-28 text-sm tracking-widest">
                    {slot.startTime} <span className="text-zinc-600 font-normal mx-1">-</span> {slot.endTime}
                  </div>
                  
                  <div className="flex-1 px-6">
                    <div className="h-[2px] w-full bg-zinc-800 rounded-full overflow-hidden relative">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (slot.occupancy / slot.capacity) * 100)}%` }}
                          transition={{ duration: 1, delay: i * 0.05 }}
                          className={`absolute top-0 left-0 h-full ${slot.isFull ? 'bg-red-500' : 'bg-[#4F8BFF]'}`}
                        />
                    </div>
                  </div>

                  <div className="w-28 text-right flex flex-col justify-center">
                    {slot.isFull ? (
                      <span className="text-red-400 font-bold text-xs tracking-wide uppercase">
                        MAX CAPACITY
                      </span>
                    ) : (
                      <>
                        <span className="text-sm font-bold text-white whitespace-nowrap">{slot.available} Slots Open</span>
                        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">{slot.occupancy}/{slot.capacity} Active</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-zinc-800 rounded-3xl bg-[#16161E]">
              <p className="text-zinc-500 font-medium">No telemetry data found for this cycle.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
