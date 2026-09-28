'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, CheckCircle2, Loader2, Plus, Trash2, CalendarDays, Clock, Users } from 'lucide-react';
import { createBooking, checkAvailability } from '@/lib/actions/booking';
import { motion, AnimatePresence } from 'framer-motion';

const neuRaised = "bg-[#e0e5ec] shadow-[8px_8px_16px_#c8d0e7,-8px_-8px_16px_#ffffff] rounded-2xl";
const neuPressed = "bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#c8d0e7,inset_-6px_-6px_12px_#ffffff] rounded-2xl";
const neuInput = "w-full bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff] rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border-none placeholder:text-slate-400";
const neuButton = "w-full py-4 text-blue-600 font-bold bg-[#e0e5ec] shadow-[8px_8px_16px_#c8d0e7,-8px_-8px_16px_#ffffff] hover:shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff] rounded-xl transition-all disabled:opacity-50 flex items-center justify-center";

const bookingSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  peopleCount: z.coerce.number().min(1).max(21),
  purpose: z.string().min(1, 'Purpose is required'),
  projectName: z.string().min(1, 'Project name is required'),
  description: z.string().min(10, 'Please provide a brief description'),
  members: z.array(
    z.object({
      name: z.string().min(1, 'Name is required'),
      studentId: z.string().min(1, 'Student ID is required'),
    })
  ).min(1, 'At least one member is required'),
}).refine(data => data.members.length === data.peopleCount, {
  message: "Members listed must match capacity count",
  path: ["members"],
}).refine(data => data.startTime < data.endTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingForm({ roomId, leaderName, leaderId }: { roomId: string, leaderName: string, leaderId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [availabilityMsg, setAvailabilityMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '12:00',
      peopleCount: 2,
      purpose: 'Prototype Development',
      projectName: '',
      description: '',
      members: [{ name: leaderName, studentId: 'Leader ID' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const verifyAvailability = async () => {
    setIsChecking(true);
    setAvailabilityMsg(null);
    try {
      const res = await checkAvailability(roomId, form.getValues('date'), form.getValues('startTime'), form.getValues('endTime'), form.getValues('peopleCount'));
      if (res.isValid) {
        setAvailabilityMsg({ type: 'success', text: `Available! Peak occupancy during this slot will be ${res.maxOccupancy}/21.` });
        setTimeout(() => setStep(2), 600);
      } else {
        setAvailabilityMsg({ type: 'error', text: `Capacity Exceeded! Facility would hit ${res.maxOccupancy}/21.` });
      }
    } catch (e) {
      setAvailabilityMsg({ type: 'error', text: 'Telemetry failed. Try again.' });
    }
    setIsChecking(false);
  };

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await createBooking(roomId, data);
      if (res.success) {
        setBookingId(res.bookingId!);
        setStep(4);
      } else {
        setAvailabilityMsg({ type: 'error', text: res.error || 'Launch sequence aborted.' });
      }
    } catch (e) {
      setAvailabilityMsg({ type: 'error', text: 'System Error. Try again.' });
    }
    setIsSubmitting(false);
  };

  const handlePeopleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    form.setValue('peopleCount', count);
    
    if (count > fields.length) {
      for (let i = 0; i < count - fields.length; i++) append({ name: '', studentId: '' });
    } else if (count < fields.length && count > 0) {
      for (let i = 0; i < fields.length - count; i++) remove(fields.length - 1);
    }
  };

  const formErrors = form.formState.errors;

  if (step === 4) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-10 md:p-16 text-center ${neuRaised}`}>
        <div className={`w-24 h-24 mx-auto flex items-center justify-center rounded-full text-green-500 mb-8 ${neuPressed}`}>
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Slot Confirmed</h2>
        <p className="text-slate-500 font-medium mb-8">Your R&D Cell 414 incubator slot has been successfully allocated.</p>
        <div className={`inline-block px-8 py-4 font-mono font-bold text-xl text-blue-600 mb-12 ${neuPressed}`}>
          {bookingId}
        </div>
        <button onClick={() => router.push('/dashboard')} className={neuButton}>
          Return to Dashboard
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#c8d0e7] -z-10 -translate-y-1/2"></div>
        {[1, 2, 3].map(num => (
          <div key={num} className="flex flex-col items-center gap-3 bg-[#e0e5ec] px-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors ${
              step >= num ? 'text-blue-600 shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff]' : 'text-slate-400 shadow-[4px_4px_8px_#c8d0e7,-4px_-4px_8px_#ffffff]'
            }`}>
              {num}
            </div>
            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${step >= num ? 'text-blue-600' : 'text-slate-400'}`}>
              {num === 1 ? 'Schedule' : num === 2 ? 'Details' : 'Crew'}
            </span>
          </div>
        ))}
      </div>

      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`p-8 md:p-12 ${neuRaised}`}>
        
        {/* Availability Messages */}
        <AnimatePresence>
          {availabilityMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className={`mb-8 p-6 flex items-center gap-4 ${neuPressed} ${availabilityMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
              {availabilityMsg.type === 'success' ? <CheckCircle2 className="w-6 h-6 flex-shrink-0" /> : <AlertCircle className="w-6 h-6 flex-shrink-0" />}
              <span className="font-bold">{availabilityMsg.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {step === 1 && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-slate-800">Select Time Slot</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-2">Target Date</label>
                  <input type="date" {...form.register('date')} className={neuInput} />
                  {formErrors.date && <p className="text-red-500 text-xs pl-2">{formErrors.date.message}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-2">Total People</label>
                  <input type="number" min={1} max={21} {...form.register('peopleCount')} onChange={handlePeopleCountChange} className={neuInput} />
                  {formErrors.peopleCount && <p className="text-red-500 text-xs pl-2">{formErrors.peopleCount.message}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-2">Start Time</label>
                  <input type="time" {...form.register('startTime')} className={neuInput} />
                  {formErrors.startTime && <p className="text-red-500 text-xs pl-2">{formErrors.startTime.message}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-2">End Time</label>
                  <input type="time" {...form.register('endTime')} className={neuInput} />
                  {formErrors.endTime && <p className="text-red-500 text-xs pl-2">{formErrors.endTime.message}</p>}
                </div>
              </div>
              <button type="button" onClick={verifyAvailability} disabled={isChecking} className={`mt-8 ${neuButton}`}>
                {isChecking ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Check Availability'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-slate-800">Project Details</h3>
              
              <div className="space-y-3">
                <label className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-2">Project Name</label>
                <input {...form.register('projectName')} placeholder="e.g. AI Robot Prototype" className={neuInput} />
                {formErrors.projectName && <p className="text-red-500 text-xs pl-2">{formErrors.projectName.message}</p>}
              </div>
              
              <div className="space-y-3">
                <label className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-2">Purpose</label>
                <select {...form.register('purpose')} className={`${neuInput} appearance-none`}>
                  <option value="Prototype Development">Prototype Development</option>
                  <option value="Hardware Testing">Hardware Testing</option>
                  <option value="Design Meeting">Design Meeting</option>
                  <option value="Research">Research</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-2">Description</label>
                <textarea {...form.register('description')} rows={4} className={`${neuInput} resize-none`} placeholder="What are you working on?" />
                {formErrors.description && <p className="text-red-500 text-xs pl-2">{formErrors.description.message}</p>}
              </div>
              
              <div className="flex gap-6 pt-4">
                <button type="button" onClick={() => setStep(1)} className={`w-1/3 py-4 text-slate-500 font-bold ${neuRaised} hover:shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff] transition-all rounded-xl`}>
                  Back
                </button>
                <button type="button" onClick={() => setStep(3)} className={`flex-1 py-4 text-blue-600 font-bold ${neuRaised} hover:shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff] transition-all rounded-xl`}>
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-800">Team Members</h3>
                <span className={`px-4 py-2 font-bold text-blue-600 text-sm ${neuPressed}`}>
                  {fields.length} / {form.getValues('peopleCount')}
                </span>
              </div>
              
              {formErrors.members?.root && <p className="text-red-500 text-sm font-bold">{formErrors.members.root.message}</p>}

              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className={`p-6 flex flex-col md:flex-row gap-6 relative ${neuPressed}`}>
                    <div className="flex-1 space-y-2">
                      <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Name</label>
                      <input {...form.register(`members.${index}.name` as const)} placeholder="Student Name" className="w-full bg-transparent border-b-2 border-slate-300 px-2 py-1 text-slate-700 focus:outline-none focus:border-blue-500 font-medium" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Roll No / ID</label>
                      <input {...form.register(`members.${index}.studentId` as const)} placeholder="ID Number" className="w-full bg-transparent border-b-2 border-slate-300 px-2 py-1 text-slate-700 focus:outline-none focus:border-blue-500 font-medium" />
                    </div>
                    {index > 0 && (
                      <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 md:static md:mt-6 w-10 h-10 flex items-center justify-center text-red-500 hover:text-red-600 rounded-full shadow-[4px_4px_8px_#c8d0e7,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff] transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {fields.length < form.getValues('peopleCount') && (
                <button type="button" onClick={() => append({ name: '', studentId: '' })} className={`w-full py-4 text-slate-500 font-bold flex items-center justify-center gap-2 ${neuPressed} hover:text-blue-600 transition-colors`}>
                  <Plus className="w-5 h-5" /> Add Member
                </button>
              )}

              <div className="flex gap-6 pt-4">
                <button type="button" onClick={() => setStep(2)} className={`w-1/3 py-4 text-slate-500 font-bold ${neuRaised} hover:shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff] transition-all rounded-xl`}>
                  Back
                </button>
                <button type="submit" disabled={isSubmitting} className={neuButton}>
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

        </form>
      </motion.div>
    </div>
  );
}
