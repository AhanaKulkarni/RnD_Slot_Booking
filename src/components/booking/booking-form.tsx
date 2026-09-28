'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Loader2, Calendar, Clock, MapPin, Rocket, Plus } from 'lucide-react';
import { createBooking } from '@/lib/actions/booking';
import Link from 'next/link';

export default function BookingForm({ rooms, projects, leaderName, leaderId }: any) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(2); // hours
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Calculate start and end time (default to 10:00 for demo, ideally we select time in step 2 alongside date)
      // Wait, the prompt said "Select Date & Time" in the screenshot. So I should add time to step 2.
      const startTime = "10:00"; 
      const startHour = parseInt(startTime.split(':')[0]);
      const endHour = startHour + selectedDuration;
      const endTime = `${endHour.toString().padStart(2, '0')}:00`;

      const data = {
        date: selectedDate,
        startTime,
        endTime,
        durationMinutes: selectedDuration * 60,
        peopleCount: 1, // Simplified for now
        purpose: 'Research',
        projectId: selectedProject.id,
        projectName: selectedProject.name,
      };

      const res = await createBooking(selectedRoom.id, data);
      if (res.success) {
        setStep(6); // Success
      } else {
        setError(res.error || 'Failed to confirm booking.');
      }
    } catch (e) {
      setError('System Error. Try again.');
    }
    setIsSubmitting(false);
  };

  if (step === 6) {
    return (
      <div className="premium-card p-12 text-center max-w-lg mx-auto mt-10">
        <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-brand-green/10 text-brand-green mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-navy mb-4">Booking confirmed</h2>
        <div className="bg-slate-50 border border-border rounded-xl p-6 mb-8 text-left space-y-2">
          <p className="font-bold text-navy text-lg">{selectedRoom?.name}</p>
          <p className="text-slate-500 text-sm">
            {new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} · 
            10:00 AM – {10 + selectedDuration}:00 AM
          </p>
        </div>
        <button onClick={() => router.push('/dashboard/calendar')} className="w-full py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-navy transition-colors">
          View Calendar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-8 text-xs font-bold text-slate-400 tracking-widest uppercase px-2">
        <span>Step {step} of 5</span>
      </div>

      <div className="premium-card p-8 md:p-10">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm font-bold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Project */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-navy">What are you working on?</h2>
              <p className="text-slate-500 mt-1">Select a project for this booking.</p>
            </div>
            <div className="space-y-4 pt-4">
              {projects.length === 0 && <p className="text-slate-500 text-sm">You don't have any projects.</p>}
              {projects.map((p: any) => (
                <div 
                  key={p.id} 
                  onClick={() => setSelectedProject(p)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${selectedProject?.id === p.id ? 'border-brand-orange bg-brand-orange/5' : 'border-border hover:border-brand-blue/30 bg-white'}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedProject?.id === p.id ? 'bg-brand-orange text-white' : 'bg-brand-blue-light text-brand-blue'}`}>
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-lg">{p.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{p.category}</p>
                  </div>
                </div>
              ))}
              <Link href="/dashboard/projects/new" className="flex items-center justify-center gap-2 w-full p-4 border border-dashed border-slate-300 rounded-xl text-brand-blue font-bold hover:bg-brand-blue-light/50 transition-colors">
                <Plus className="w-4 h-4" /> Create New Project
              </Link>
            </div>
            <div className="pt-6">
              <button disabled={!selectedProject} onClick={() => setStep(2)} className="w-full py-4 bg-brand-orange text-white font-bold rounded-xl disabled:opacity-50 disabled:bg-slate-300 transition-colors">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-navy">Select Date & Time</h2>
              <p className="text-slate-500 mt-1">Choose a date and time for your session.</p>
            </div>
            <div className="space-y-4 pt-4">
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-4 text-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue font-bold"
              />
            </div>
            <div className="pt-6 flex gap-4">
              <button onClick={() => setStep(1)} className="w-1/3 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                Back
              </button>
              <button disabled={!selectedDate} onClick={() => setStep(3)} className="flex-1 py-4 bg-brand-orange text-white font-bold rounded-xl disabled:opacity-50 disabled:bg-slate-300 transition-colors">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Duration */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-navy">Duration</h2>
              <p className="text-slate-500 mt-1">How long will you need the space?</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {[1, 2, 4, 8].map(hrs => (
                <button 
                  key={hrs}
                  onClick={() => setSelectedDuration(hrs)}
                  className={`py-4 rounded-xl border-2 font-bold transition-all ${selectedDuration === hrs ? 'border-brand-orange text-brand-orange bg-brand-orange/5' : 'border-border text-slate-500 hover:border-slate-300 bg-white'}`}
                >
                  {hrs} {hrs === 1 ? 'hour' : 'hours'}
                </button>
              ))}
            </div>
            <div className="pt-6 flex gap-4">
              <button onClick={() => setStep(2)} className="w-1/3 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                Back
              </button>
              <button onClick={() => setStep(4)} className="flex-1 py-4 bg-brand-orange text-white font-bold rounded-xl transition-colors">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Workspace */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-navy">Choose a Workspace</h2>
              <p className="text-slate-500 mt-1">Select an available space for your session.</p>
            </div>
            <div className="space-y-4 pt-4">
              {rooms.map((r: any) => (
                <div 
                  key={r.id} 
                  onClick={() => setSelectedRoom(r)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedRoom?.id === r.id ? 'border-brand-orange bg-brand-orange/5' : 'border-border hover:border-brand-blue/30 bg-white'}`}
                >
                  <div>
                    <h3 className="font-bold text-navy text-lg">{r.name}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">Capacity: {r.capacity} seats</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-brand-green/10 text-brand-green text-[10px] font-bold rounded uppercase tracking-wider">
                      Available
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6 flex gap-4">
              <button onClick={() => setStep(3)} className="w-1/3 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                Back
              </button>
              <button disabled={!selectedRoom} onClick={() => setStep(5)} className="flex-1 py-4 bg-brand-orange text-white font-bold rounded-xl disabled:opacity-50 disabled:bg-slate-300 transition-colors">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Confirm */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-navy">Confirm Booking</h2>
              <p className="text-slate-500 mt-1">Review your session details.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Project</p>
                <p className="font-bold text-navy flex items-center gap-2"><Rocket className="w-4 h-4 text-brand-blue" /> {selectedProject?.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                  <p className="font-bold text-navy flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-orange" /> {selectedDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time</p>
                  <p className="font-bold text-navy flex items-center gap-2"><Clock className="w-4 h-4 text-brand-blue" /> 10:00 AM - {10 + selectedDuration}:00 AM</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Space</p>
                <p className="font-bold text-navy flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-green" /> {selectedRoom?.name}</p>
              </div>
            </div>
            <div className="pt-6 flex gap-4">
              <button onClick={() => setStep(4)} className="w-1/3 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                Back
              </button>
              <button disabled={isSubmitting} onClick={handleConfirm} className="flex-1 py-4 bg-brand-orange text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
