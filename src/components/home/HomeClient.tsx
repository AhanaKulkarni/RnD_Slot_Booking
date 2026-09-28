'use client';

import Link from 'next/link';
import { ShieldCheck, LogIn, Calendar, Users, MapPin, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeClient() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <header className="px-6 py-6 md:px-12 flex justify-between items-center z-10 border-b border-border bg-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center bg-brand-blue text-white rounded-lg transform -rotate-12">
            <Rocket className="w-5 h-5 transform rotate-12" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-navy">R&D Portal</span>
        </div>
        <Link href="/login">
          <button className="text-navy hover:text-brand-blue font-bold px-6 h-12 rounded-xl transition-all border border-border hover:border-brand-blue/30 bg-white shadow-sm flex items-center">
            <LogIn className="w-4 h-4 mr-2" /> Login
          </button>
        </Link>
      </header>

      <main className="flex-1 px-6 md:px-12 pb-20 pt-20 flex flex-col items-center relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue-light/50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="text-center max-w-4xl mx-auto space-y-6 mb-20 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 font-bold text-xs text-brand-blue mb-4 bg-brand-blue-light rounded-full uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Official R&D Ecosystem Platform
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold text-navy leading-tight tracking-tight">
            Accelerate your <br/><span className="text-brand-blue">Startup & Research</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mt-6">
            The premium workspace management platform for EDIC founders. Manage your projects, secure lab time, and collaborate seamlessly.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pt-8">
            <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-navy transition-all shadow-sm text-lg">
              Enter Workspace <Rocket className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl z-10 relative">
          <FeatureCard 
            icon={<MapPin className="text-brand-orange" />} 
            title="Premium Facilities" 
            desc="Access state-of-the-art labs, prototyping equipment, and dedicated meeting rooms." 
          />
          <FeatureCard 
            icon={<Calendar className="text-brand-blue" />} 
            title="Smart Scheduling" 
            desc="Book your sessions seamlessly without overlapping with other active startups." 
          />
          <FeatureCard 
            icon={<Users className="text-brand-green" />} 
            title="Founder Network" 
            desc="Connect with faculty mentors and collaborate with other ambitious founders." 
          />
        </div>

      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="premium-card p-8 group">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-navy mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}
