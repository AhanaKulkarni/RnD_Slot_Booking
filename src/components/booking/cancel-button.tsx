'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleCancel}
      disabled={isCanceling}
      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-3 rounded-full border border-red-500/20"
    >
      {isCanceling ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <XCircle className="w-4 h-4 mr-1.5" />
          Cancel
        </>
      )}
    </Button>
  );
}
