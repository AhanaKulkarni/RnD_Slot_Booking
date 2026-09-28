'use client';

import { useState } from 'react';
import { Loader2, XCircle } from 'lucide-react';
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
      className="flex items-center gap-2 text-red-500 font-bold px-4 py-2 rounded-xl bg-[#e0e5ec] shadow-[4px_4px_8px_#c8d0e7,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff] transition-all disabled:opacity-50"
    >
      {isCanceling ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <XCircle className="w-4 h-4" />
          Cancel
        </>
      )}
    </button>
  );
}
