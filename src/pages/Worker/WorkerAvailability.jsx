// frontend/src/pages/Worker/WorkerAvailability.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';

const WorkerAvailability = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  // Generate next 14 days
  const getNext14Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      });
    }
    return days;
  };

  const days = getNext14Days();

  const toggleDate = (date) => {
    setSelectedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const toggleSlot = (slot) => {
    setSelectedSlots(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );
  };

  const selectAllDates = () => {
    setSelectedDates(days.map(d => d.date));
  };

  const selectWeekdays = () => {
    setSelectedDates(days.filter(d => !d.isWeekend).map(d => d.date));
  };

  const selectAllSlots = () => {
    setSelectedSlots([...timeSlots]);
  };

  const selectBusinessHours = () => {
    setSelectedSlots(['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']);
  };

  const handleSave = async () => {
    if (selectedDates.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one date' });
      return;
    }
    if (selectedSlots.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one time slot' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/availability/worker', {
        dates: selectedDates,
        slots: selectedSlots
      });
      setMessage({ type: 'success', text: 'Availability updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save availability' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Availability</h1>
        <p className="text-gray-400 mt-2">
          Set when you're available to accept jobs
        </p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Date Selection */}
      <div className="panel-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Select Dates</h3>
          <div className="flex space-x-2">
            <button
              onClick={selectAllDates}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Select All
            </button>
            <span className="text-gray-600">|</span>
            <button
              onClick={selectWeekdays}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Weekdays Only
            </button>
            <span className="text-gray-600">|</span>
            <button
              onClick={() => setSelectedDates([])}
              className="text-sm text-gray-400 hover:text-gray-300"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const isSelected = selectedDates.includes(day.date);
            return (
              <button
                key={day.date}
                onClick={() => toggleDate(day.date)}
                className={`p-3 rounded-lg text-center transition ${
                  isSelected
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                } ${day.isWeekend ? 'border border-yellow-500/30' : ''}`}
              >
                <div className="text-xs opacity-70">{day.dayName}</div>
                <div className="text-lg font-bold">{day.dayNumber}</div>
                <div className="text-xs opacity-70">{day.month}</div>
              </button>
            );
          })}
        </div>

        <p className="text-gray-500 text-sm mt-4">
          {selectedDates.length} day(s) selected
          {selectedDates.some(d => days.find(day => day.date === d)?.isWeekend) && 
            <span className="text-yellow-400 ml-2">• Weekend days earn 20% more</span>
          }
        </p>
      </div>

      {/* Time Slot Selection */}
      <div className="panel-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Select Time Slots</h3>
          <div className="flex space-x-2">
            <button
              onClick={selectAllSlots}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Select All
            </button>
            <span className="text-gray-600">|</span>
            <button
              onClick={selectBusinessHours}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Business Hours
            </button>
            <span className="text-gray-600">|</span>
            <button
              onClick={() => setSelectedSlots([])}
              className="text-sm text-gray-400 hover:text-gray-300"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {timeSlots.map((slot) => {
            const isSelected = selectedSlots.includes(slot);
            const isPeakHour = ['08:00', '09:00', '17:00', '18:00'].includes(slot);
            return (
              <button
                key={slot}
                onClick={() => toggleSlot(slot)}
                className={`p-3 rounded-lg text-center transition ${
                  isSelected
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="font-medium">{formatTime(slot)}</div>
                {isPeakHour && (
                  <div className="text-xs mt-1 text-yellow-400">Peak</div>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-gray-500 text-sm mt-4">
          {selectedSlots.length} slot(s) selected
          {selectedSlots.some(s => ['08:00', '09:00', '17:00', '18:00'].includes(s)) && 
            <span className="text-yellow-400 ml-2">• Peak hours earn extra</span>
          }
        </p>
      </div>

      {/* Summary */}
      <div className="panel-card p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-lg text-center">
            <p className="text-3xl font-bold text-purple-400">{selectedDates.length}</p>
            <p className="text-gray-500">Days Available</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg text-center">
            <p className="text-3xl font-bold text-cyan-400">{selectedSlots.length}</p>
            <p className="text-gray-500">Slots Per Day</p>
          </div>
        </div>
        <p className="text-gray-400 text-center mt-4">
          Total: <span className="text-white font-bold">{selectedDates.length * selectedSlots.length}</span> available booking slots
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving || selectedDates.length === 0 || selectedSlots.length === 0}
        className="w-full btn-accent flex items-center justify-center disabled:opacity-50"
      >
        {saving ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            Saving...
          </>
        ) : (
          'Save Availability'
        )}
      </button>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="text-white font-medium">Tips</h4>
            <ul className="text-gray-400 text-sm mt-1 space-y-1">
              <li>• Jobs will only be shown to you during your available times</li>
              <li>• Weekend and peak hour jobs often pay more</li>
              <li>• Update your availability weekly for best results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerAvailability;