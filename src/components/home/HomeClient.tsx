'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck, LogIn, Calendar, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const neuRaised = "bg-[#e0e5ec] shadow-[8px_8px_16px_#c8d0e7,-8px_-8px_16px_#ffffff] rounded-2xl";
const neuPressed = "bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#c8d0e7,inset_-6px_-6px_12px_#ffffff] rounded-2xl";

export default function HomeClient() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-slate-700 font-sans flex flex-col">
      <header className="px-6 py-6 md:px-12 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 flex items-center justify-center ${neuRaised}`}>
            <MapPin className="w-6 h-6 text-blue-500" />
          </div>
          <span className="text-xl font-bold tracking-wide text-slate-700">R&D Slot Booking</span>
        </div>
        <Link href="/login">
          <Button className={`text-slate-600 hover:text-blue-500 font-bold px-6 h-12 ${neuRaised} hover:shadow-[4px_4px_8px_#c8d0e7,-4px_-4px_8px_#ffffff] transition-all bg-[#e0e5ec] hover:bg-[#e0e5ec]`}>
            <LogIn className="w-4 h-4 mr-2" /> Login
          </Button>
        </Link>
      </header>

      <main className="flex-1 px-6 md:px-12 pb-20 pt-10 flex flex-col items-center">
        
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-blue-600 mb-4 ${neuPressed}`}>
            <ShieldCheck className="w-4 h-4" /> Official Room 414 Booking Portal
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold text-slate-800 leading-tight">
            Reserve Your Space in the R&D Cell
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-slate-500 max-w-xl mx-auto">
            Check real-time availability and secure your team's slot in Room 414.
          </motion.p>
        </div>

        {/* Live Availability Section */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`w-full max-w-4xl p-8 md:p-12 ${neuRaised}`}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-3">
              <Calendar className="text-blue-500" /> Availability Check
            </h2>
            <div className={`px-4 py-2 flex items-center gap-3 ${neuPressed}`}>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent border-none text-slate-700 font-medium focus:outline-none focus:ring-0" />
            </div>
          </div>

          <div className="space-y-8">
            {['10:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00'].map((time, i) => (
              <div key={time} className={`p-6 ${neuPressed} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center font-bold text-blue-500 ${neuRaised}`}>
                    {time.split(':')[0]}
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-700">{time}</div>
                    <div className="text-sm text-slate-500">Session Window</div>
                  </div>
                </div>
                
                <div className="flex-1 max-w-xs w-full">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-500 uppercase tracking-wider">Occupancy</span>
                    <span className="text-blue-600">{i === 0 ? '8' : i === 1 ? '20' : '4'} / 21</span>
                  </div>
                  <div className={`h-4 w-full rounded-full overflow-hidden ${neuPressed}`}>
                    <div className={`h-full rounded-full ${i === 1 ? 'bg-orange-400' : 'bg-blue-500'}`} style={{ width: i === 0 ? '38%' : i === 1 ? '95%' : '19%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </main>
    </div>
  );
}
