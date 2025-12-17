// frontend/src/components/booking/TimeSlotPicker.jsx
import { useState, useEffect } from 'react';
import { getAvailableSlots } from '../../services/availability';
import { Clock, Calendar, AlertTriangle, AlertCircle, Frown, Lightbulb, Check } from 'lucide-react';

// Fallback slots in case service fails
const DEFAULT_SLOTS = [
  { time: '09:00', displayTime: '09:00 AM', isAvailable: true, isPeakHour: true, remainingSlots: 5 },
  { time: '10:00', displayTime: '10:00 AM', isAvailable: true, isPeakHour: false, remainingSlots: 5 },
  { time: '11:00', displayTime: '11:00 AM', isAvailable: true, isPeakHour: false, remainingSlots: 5 },
  { time: '12:00', displayTime: '12:00 PM', isAvailable: true, isPeakHour: false, remainingSlots: 5 },
  { time: '13:00', displayTime: '01:00 PM', isAvailable: true, isPeakHour: false, remainingSlots: 5 },
  { time: '14:00', displayTime: '02:00 PM', isAvailable: true, isPeakHour: false, remainingSlots: 5 },
  { time: '15:00', displayTime: '03:00 PM', isAvailable: true, isPeakHour: false, remainingSlots: 5 },
  { time: '16:00', displayTime: '04:00 PM', isAvailable: true, isPeakHour: false, remainingSlots: 5 },
  { time: '17:00', displayTime: '05:00 PM', isAvailable: true, isPeakHour: false, remainingSlots: 5 },
  { time: '18:00', displayTime: '06:00 PM', isAvailable: true, isPeakHour: true, remainingSlots: 5 }
];

const TimeSlotPicker = ({ date, category, selectedSlot, onSelectSlot }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (date) {
      fetchSlots();
    } else {
      setSlots([]);
    }
  }, [date, category]);

  const fetchSlots = async () => {
    if (!date) return;

    setLoading(true);
    setError('');

    console.log('TimeSlotPicker: Fetching slots for', { date, category });

    try {
      const response = await getAvailableSlots(date, category);
      console.log('TimeSlotPicker: Got response', response);

      const slotsData = response?.data?.slots || response?.slots || [];

      if (slotsData.length > 0) {
        setSlots(slotsData);
      } else {
        console.log('TimeSlotPicker: Empty response, using defaults');
        setSlots(DEFAULT_SLOTS);
      }
    } catch (err) {
      console.error('TimeSlotPicker: Failed to fetch slots:', err);
      setError('Failed to load time slots');
      setSlots(DEFAULT_SLOTS); // Use fallback on error
    } finally {
      setLoading(false);
    }
  };

  if (!date) {
    return (
      <div className="panel-card p-6 text-center text-gray-400">
        <div className="flex justify-center mb-2"><Calendar size={36} /></div>
        Please select a date first
      </div>
    );
  }

  if (loading) {
    return (
      <div className="panel-card p-6 flex flex-col items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500 mb-3"></div>
        <p className="text-gray-400 text-sm">Loading available slots...</p>
      </div>
    );
  }

  if (error && slots.length === 0) {
    return (
      <div className="panel-card p-6 text-center">
        <div className="flex justify-center mb-2"><AlertTriangle size={36} className="text-yellow-500" /></div>
        <p className="text-red-400 mb-3">{error}</p>
        <button
          onClick={fetchSlots}
          className="text-purple-400 hover:text-purple-300 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="panel-card p-6 text-center text-gray-400">
        <div className="flex justify-center mb-2"><Frown size={36} /></div>
        <p>No time slots available for this date.</p>
        <p className="text-sm mt-2">Please try another date.</p>
      </div>
    );
  }

  return (
    <div className="panel-card p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Clock className="mr-2" size={20} /> Select Time Slot
      </h3>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot.time;
          const isAvailable = slot.isAvailable !== false;

          return (
            <button
              key={slot.time}
              onClick={() => isAvailable && onSelectSlot(slot.time)}
              disabled={!isAvailable}
              className={`
                p-4 rounded-lg text-center transition-all relative
                ${isSelected
                  ? 'bg-purple-500 text-white ring-2 ring-purple-400 scale-105'
                  : isAvailable
                    ? 'bg-gray-800 text-white hover:bg-gray-700 hover:scale-102'
                    : 'bg-gray-900 text-gray-600 cursor-not-allowed line-through opacity-50'
                }
              `}
            >
              <div className="font-semibold">{slot.displayTime}</div>

              {slot.isPeakHour && isAvailable && (
                <div className="text-xs text-yellow-400 mt-1">Peak Hour</div>
              )}

              {isAvailable && slot.remainingSlots && slot.remainingSlots <= 3 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                  {slot.remainingSlots} left
                </div>
              )}

              {isSelected && (
                <div className="absolute -top-1 -left-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  <Check size={12} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-sm text-gray-400 flex items-center">
        <Lightbulb size={16} className="mr-2 text-yellow-500" />
        Peak hours (9 AM & 6 PM) may have additional charges
      </div>

      {/* Selected slot confirmation */}
      {selectedSlot && (
        <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm text-purple-300 flex items-center">
          <Check size={16} className="mr-2" />
          Selected: {slots.find(s => s.time === selectedSlot)?.displayTime || selectedSlot}
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;