// frontend/src/services/availability.js
import api from './api';

// Default time slots as fallback
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

// Generate dates for next N days
const generateDates = (days = 14) => {
  const dates = [];
  const today = new Date();
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();
    
    dates.push({
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-IN', { weekday: 'short' }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString('en-IN', { month: 'short' }),
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isAvailable: true
    });
  }
  
  return dates;
};

// Get available dates
export const getAvailableDates = async (category, days = 30) => {
  try {
    const response = await api.get('/availability/dates', {
      params: { category, days }
    });
    
    if (response.data?.data && response.data.data.length > 0) {
      return response;
    }
    
    // Return fallback
    return { data: { data: generateDates(days) } };
  } catch (error) {
    console.warn('Using fallback dates:', error.message);
    return { data: { data: generateDates(days) } };
  }
};

// Get available time slots
export const getAvailableSlots = async (date, category) => {
  try {
    const response = await api.get('/availability/slots', {
      params: { date, category }
    });
    
    console.log('Slots API response:', response.data);
    
    if (response.data?.data && response.data.data.length > 0) {
      return { data: { slots: response.data.data } };
    }
    
    if (response.data?.slots && response.data.slots.length > 0) {
      return { data: { slots: response.data.slots } };
    }
    
    // Return fallback
    console.log('Using fallback slots');
    return { data: { slots: DEFAULT_SLOTS } };
  } catch (error) {
    console.warn('Slots API error, using fallback:', error.message);
    return { data: { slots: DEFAULT_SLOTS } };
  }
};

// Check specific slot availability
export const checkSlotAvailability = async (date, time, category) => {
  try {
    const response = await api.get('/availability/check', {
      params: { date, time, category }
    });
    return response.data;
  } catch (error) {
    console.warn('Availability check failed:', error.message);
    return { available: true }; // Default to available
  }
};

export default {
  getAvailableDates,
  getAvailableSlots,
  checkSlotAvailability
};