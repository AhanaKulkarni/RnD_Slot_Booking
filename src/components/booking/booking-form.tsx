'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle2, Loader2, Plus, Trash2, CalendarDays, Clock, Users } from 'lucide-react';
import { createBooking, checkAvailability } from '@/lib/actions/booking';
import { motion, AnimatePresence } from 'framer-motion';

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
        setTimeout(() => setStep(2), 600); // Small delay to let user read success msg
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
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#16161E] rounded-3xl p-8 md:p-12 shadow-2xl border border-white/5 text-center">
        <CheckCircle2 className="w-20 h-20 text-[#4F8BFF] mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold text-white font-serif tracking-wide mb-4">Slot Confirmed</h2>
        <p className="text-zinc-400 font-serif mb-8 max-w-sm mx-auto">Your R&D Cell 414 incubator slot has been successfully allocated.</p>
        <div className="bg-[#0B0C10] inline-block px-6 py-4 rounded-2xl border border-white/5 font-mono font-bold text-xl text-[#4F8BFF] mb-10 tracking-widest shadow-inner">
          {bookingId}
        </div>
        <div className="flex justify-center">
          <Button onClick={() => router.push('/dashboard')} className="bg-white text-black hover:bg-zinc-200 rounded-full font-bold px-10 py-6 text-lg w-full md:w-auto">
            Return to Command
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 md:mb-12 relative px-2">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-800 -z-10 -translate-y-1/2"></div>
        {[1, 2, 3].map(num => (
          <div key={num} className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold transition-colors ${
              step >= num ? 'bg-[#4F8BFF] text-white shadow-[0_0_15px_rgba(79,139,255,0.4)]' : 'bg-[#1A1A24] border border-zinc-800 text-zinc-500'
            }`}>
              {num}
            </div>
            <span className={`text-[10px] md:text-xs tracking-widest uppercase hidden md:block ${step >= num ? 'text-white font-bold' : 'text-zinc-600'}`}>
              {num === 1 ? 'Schedule' : num === 2 ? 'Mission' : 'Crew'}
            </span>
          </div>
        ))}
      </div>

      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#16161E] rounded-3xl p-6 md:p-10 shadow-2xl border border-white/5">
        
        {/* Availability Messages */}
        <AnimatePresence>
          {availabilityMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border ${availabilityMsg.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {availabilityMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              <span className="text-sm font-medium">{availabilityMsg.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white font-serif mb-6">Select Launch Window</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs tracking-widest uppercase">Target Date</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input type="date" {...form.register('date')} className="bg-[#0B0C10] border-zinc-800 text-white rounded-xl pl-12 h-12 w-full focus-visible:ring-[#4F8BFF]" />
                  </div>
                  {formErrors.date && <p className="text-red-400 text-xs mt-1">{formErrors.date.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs tracking-widest uppercase">Crew Size</Label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input type="number" min={1} max={21} {...form.register('peopleCount')} onChange={handlePeopleCountChange} className="bg-[#0B0C10] border-zinc-800 text-white rounded-xl pl-12 h-12 w-full focus-visible:ring-[#4F8BFF]" />
                  </div>
                  {formErrors.peopleCount && <p className="text-red-400 text-xs mt-1">{formErrors.peopleCount.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs tracking-widest uppercase">T-Minus (Start)</Label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input type="time" {...form.register('startTime')} className="bg-[#0B0C10] border-zinc-800 text-white rounded-xl pl-12 h-12 w-full focus-visible:ring-[#4F8BFF]" />
                  </div>
                  {formErrors.startTime && <p className="text-red-400 text-xs mt-1">{formErrors.startTime.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs tracking-widest uppercase">T-Plus (End)</Label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input type="time" {...form.register('endTime')} className="bg-[#0B0C10] border-zinc-800 text-white rounded-xl pl-12 h-12 w-full focus-visible:ring-[#4F8BFF]" />
                  </div>
                  {formErrors.endTime && <p className="text-red-400 text-xs mt-1">{formErrors.endTime.message}</p>}
                </div>
              </div>
              <Button type="button" onClick={verifyAvailability} disabled={isChecking} className="w-full bg-[#4F8BFF] text-white hover:bg-[#3d6ecc] rounded-full h-12 mt-4 font-bold tracking-wide">
                {isChecking ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Run Telemetry Check'}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white font-serif mb-6">Mission Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs tracking-widest uppercase">Project Name</Label>
                  <Input {...form.register('projectName')} placeholder="e.g. Project Apollo" className="bg-[#0B0C10] border-zinc-800 text-white rounded-xl h-12 focus-visible:ring-[#4F8BFF]" />
                  {formErrors.projectName && <p className="text-red-400 text-xs">{formErrors.projectName.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs tracking-widest uppercase">Purpose</Label>
                  <Select onValueChange={(val) => form.setValue('purpose', val)} defaultValue={form.getValues('purpose')}>
                    <SelectTrigger className="bg-[#0B0C10] border-zinc-800 text-white rounded-xl h-12 focus:ring-[#4F8BFF]">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#16161E] border-zinc-800 text-white">
                      <SelectItem value="Prototype Development">Prototype Development</SelectItem>
                      <SelectItem value="Hardware Testing">Hardware Testing</SelectItem>
                      <SelectItem value="Design Meeting">Design Meeting</SelectItem>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs tracking-widest uppercase">Brief Description</Label>
                  <textarea {...form.register('description')} rows={4} className="w-full bg-[#0B0C10] border border-zinc-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#4F8BFF] resize-none" placeholder="What are you building?" />
                  {formErrors.description && <p className="text-red-400 text-xs">{formErrors.description.message}</p>}
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 bg-transparent border-zinc-800 text-zinc-400 hover:text-white rounded-full h-12">Back</Button>
                <Button type="button" onClick={() => setStep(3)} className="flex-1 bg-white text-black hover:bg-zinc-200 rounded-full h-12 font-bold">Configure Crew</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white font-serif">Crew Manifest</h3>
                <span className="bg-[#0B0C10] text-[#4F8BFF] text-xs font-bold px-3 py-1.5 rounded-full border border-zinc-800">{fields.length} / {form.getValues('peopleCount')} Logged</span>
              </div>
              
              {formErrors.members?.root && <p className="text-red-400 text-sm mb-4">{formErrors.members.root.message}</p>}

              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-[#0B0C10] p-4 rounded-2xl border border-zinc-800 relative group">
                    <div className="w-full md:flex-1 space-y-1">
                      <Label className="text-zinc-500 text-[10px] uppercase">Crew {index + 1} Name</Label>
                      <Input {...form.register(`members.${index}.name` as const)} placeholder="Name" className="bg-transparent border-b border-zinc-800 rounded-none px-0 h-8 text-white focus-visible:ring-0 focus-visible:border-[#4F8BFF]" />
                    </div>
                    <div className="w-full md:flex-1 space-y-1">
                      <Label className="text-zinc-500 text-[10px] uppercase">ID / Roll No</Label>
                      <Input {...form.register(`members.${index}.studentId` as const)} placeholder="Student ID" className="bg-transparent border-b border-zinc-800 rounded-none px-0 h-8 text-white focus-visible:ring-0 focus-visible:border-[#4F8BFF]" />
                    </div>
                    {index > 0 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="absolute top-2 right-2 md:static md:mt-4 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {fields.length < form.getValues('peopleCount') && (
                <Button type="button" variant="outline" onClick={() => append({ name: '', studentId: '' })} className="w-full border-dashed border-zinc-800 text-zinc-400 hover:text-white bg-transparent rounded-2xl h-14">
                  <Plus className="w-4 h-4 mr-2" /> Add Crew Member
                </Button>
              )}

              <div className="flex gap-4 pt-6">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-1/3 bg-transparent border-zinc-800 text-zinc-400 hover:text-white rounded-full h-12">Back</Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#4F8BFF] text-white hover:bg-[#3d6ecc] rounded-full h-12 font-bold tracking-wide">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm Launch Sequence'}
                </Button>
              </div>
            </div>
          )}

        </form>
      </motion.div>
    </div>
  );
}
