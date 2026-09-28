'use client';

import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { cancelBooking } from '@/lib/actions/booking';

export function CancelButton({ bookingId }: { bookingId: string }) {
  const [isCanceling, setIsCanceling] = useState(false);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
    
    setIsCanceling(true);
    try {
      await cancelBooking(bookingId);
    } catch (e) {
      console.error(e);
      alert('Failed to cancel booking');
    }
    setIsCanceling(false);
  };

  return (
    <button 
      onClick={handleCancel}
      disabled={isCanceling}
      className="text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 flex items-center gap-1.5 disabled:opacity-50"
    >
      {isCanceling ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <>
          <X className="w-3.5 h-3.5" />
          Cancel
        </>
      )}
    </button>
  );
}
