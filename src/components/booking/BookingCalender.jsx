import { useState, useEffect } from 'react';
import { getAvailableDates } from '../../services/availability';

const BookingCalendar = ({ category, selectedDate, onSelectDate }) => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchDates();
  }, [category]);

  const fetchDates = async () => {
    setLoading(true);
    try {
      const response = await getAvailableDates(30, category);
      setDates(response.data);
    } catch (error) {
      console.error('Failed to fetch dates:', error);
    } finally {
      setLoading(false);
    }
  };

  const isSelected = (dateStr) => selectedDate === dateStr;
  
  const getDateStatus = (dateStr) => {
    const dateInfo = dates.find(d => d.date === dateStr);
    return dateInfo || null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="panel-card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Select Date</h3>
      
      {/* Date Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-gray-500 text-sm py-2">
            {day}
          </div>
        ))}
        
        {/* Date Cells */}
        {dates.slice(0, 28).map((dateInfo) => {
          const isAvailable = dateInfo.isAvailable;
          const selected = isSelected(dateInfo.date);
          
          return (
            <button
              key={dateInfo.date}
              onClick={() => isAvailable && onSelectDate(dateInfo.date)}
              disabled={!isAvailable}
              className={`
                p-3 rounded-lg text-center transition-all
                ${selected 
                  ? 'bg-purple-500 text-white ring-2 ring-purple-400' 
                  : isAvailable
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-gray-900 text-gray-600 cursor-not-allowed'
                }
                ${dateInfo.isWeekend && isAvailable ? 'border border-yellow-500/30' : ''}
              `}
            >
              <div className="text-lg font-semibold">{dateInfo.dayNumber}</div>
              <div className="text-xs opacity-70">{dateInfo.dayOfWeek}</div>
              {dateInfo.isWeekend && isAvailable && (
                <div className="text-xs text-yellow-400 mt-1">+20%</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-gray-800 mr-2"></div>
          <span className="text-gray-400">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-purple-500 mr-2"></div>
          <span className="text-gray-400">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded border border-yellow-500 mr-2"></div>
          <span className="text-gray-400">Weekend (+20%)</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;