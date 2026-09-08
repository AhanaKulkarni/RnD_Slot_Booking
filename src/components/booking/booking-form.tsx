'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createBooking, checkAvailability } from '@/lib/actions/booking';

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
  ).min(1, 'At least one member (you) is required'),
}).refine(data => {
  return data.members.length === data.peopleCount;
}, {
  message: "Number of members listed must match total people count",
  path: ["members"],
}).refine(data => {
  return data.startTime < data.endTime;
}, {
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
      members: [{ name: leaderName, studentId: 'Your ID (Leader)' }], // Leader is first
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const watchDate = form.watch("date");
  const watchStart = form.watch("startTime");
  const watchEnd = form.watch("endTime");
  const watchPeople = form.watch("peopleCount");

  const verifyAvailability = async () => {
    setIsChecking(true);
    setAvailabilityMsg(null);
    try {
      const res = await checkAvailability(roomId, watchDate, watchStart, watchEnd, watchPeople);
      if (res.isValid) {
        setAvailabilityMsg({ type: 'success', text: `Available! Maximum occupancy will be ${res.maxOccupancy}/21.` });
        setStep(2);
      } else {
        setAvailabilityMsg({ type: 'error', text: `Capacity exceeded during this time. Max would reach ${res.maxOccupancy}/21.` });
      }
    } catch (e) {
      setAvailabilityMsg({ type: 'error', text: 'Error checking availability.' });
    }
    setIsChecking(false);
  };

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      // Create booking via server action
      const res = await createBooking(roomId, data);
      if (res.success) {
        setBookingId(res.bookingId!);
        setStep(4); // Success step
      } else {
        setAvailabilityMsg({ type: 'error', text: res.error || 'Failed to create booking' });
      }
    } catch (e) {
      setAvailabilityMsg({ type: 'error', text: 'An unexpected error occurred.' });
    }
    setIsSubmitting(false);
  };

  // Sync member array length with peopleCount
  const handlePeopleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    form.setValue('peopleCount', count);
    
    if (count > fields.length) {
      const diff = count - fields.length;
      for (let i = 0; i < diff; i++) {
        append({ name: '', studentId: '' });
      }
    } else if (count < fields.length && count > 0) {
      const diff = fields.length - count;
      for (let i = 0; i < diff; i++) {
        remove(fields.length - 1);
      }
    }
  };

  if (step === 4) {
    return (
      <Card className="text-center py-12">
        <CardContent className="space-y-6">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-3xl font-bold text-gray-800">Booking Confirmed!</h2>
          <p className="text-gray-500">Your R&D Cell 414 slot has been reserved.</p>
          <div className="bg-gray-50 inline-block p-4 rounded-lg border font-mono font-bold text-lg">
            {bookingId}
          </div>
          <div className="pt-8">
            <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 -translate-y-1/2 transition-all" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
        
        {[1, 2, 3].map((s) => (
          <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {s}
          </div>
        ))}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* STEP 1: Date & Time */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>1. Date & Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" {...form.register('date')} />
                </div>
                <div className="space-y-2">
                  <Label>Group Size (Total People)</Label>
                  <Input type="number" min={1} max={21} {...form.register('peopleCount')} onChange={handlePeopleCountChange} />
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input type="time" step={1800} {...form.register('startTime')} />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input type="time" step={1800} {...form.register('endTime')} />
                </div>
              </div>

              {availabilityMsg && (
                <Alert variant={availabilityMsg.type === 'error' ? 'destructive' : 'default'} className={availabilityMsg.type === 'success' ? 'bg-green-50 text-green-900 border-green-200' : ''}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{availabilityMsg.type === 'success' ? 'Available' : 'Unavailable'}</AlertTitle>
                  <AlertDescription>{availabilityMsg.text}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="button" onClick={verifyAvailability} disabled={isChecking}>
                {isChecking ? 'Checking...' : 'Check Availability & Continue'}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 2: Group Members */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>2. Group Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You selected <strong>{watchPeople}</strong> people. Please list all members.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 pt-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg border">
                    <div className="flex-1 space-y-2">
                      <Label>Name {index === 0 && '(Leader)'}</Label>
                      <Input {...form.register(`members.${index}.name`)} disabled={index === 0} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Student ID</Label>
                      <Input {...form.register(`members.${index}.studentId`)} disabled={index === 0} />
                    </div>
                  </div>
                ))}
              </div>
              {form.formState.errors.members?.root?.message && (
                <p className="text-red-500 text-sm mt-2">{form.formState.errors.members.root.message}</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button type="button" onClick={async () => {
                const isValid = await form.trigger('members');
                if (isValid) setStep(3);
              }}>Continue</Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 3: Project Details */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>3. Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Purpose</Label>
                <Select onValueChange={(val) => form.setValue('purpose', val as string)} defaultValue={form.getValues('purpose')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Research / Experiment">Research / Experiment</SelectItem>
                    <SelectItem value="Project Development">Project Development</SelectItem>
                    <SelectItem value="Prototype Development">Prototype Development</SelectItem>
                    <SelectItem value="Startup / Entrepreneurship">Startup / Entrepreneurship</SelectItem>
                    <SelectItem value="Competition Preparation">Competition Preparation</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Project / Team Name</Label>
                <Input {...form.register('projectName')} />
                {form.formState.errors.projectName && <p className="text-red-500 text-sm">{form.formState.errors.projectName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Work Description</Label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="What will the group be working on?"
                  {...form.register('description')}
                />
                {form.formState.errors.description && <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
              </Button>
            </CardFooter>
          </Card>
        )}
      </form>
    </div>
  );
}
