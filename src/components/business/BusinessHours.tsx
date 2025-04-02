import React from 'react';

interface BusinessHoursProps {
  businessHours: { [key: string]: string };
  onChange: (day: string, value: string) => void;
  readOnly?: boolean;
}

const BusinessHours: React.FC<BusinessHoursProps> = ({ 
  businessHours,
  onChange,
  readOnly = false
}) => {
  // Initialize default hours if empty
  const ensuredHours = businessHours && Object.keys(businessHours).length > 0 
    ? businessHours
    : {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 5:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: '9:00 AM - 5:00 PM',
        saturday: 'Closed',
        sunday: 'Closed'
      };

  // Ensure all days exist in businessHours object
  const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const completeHours = { ...ensuredHours };
  
  // Make sure all days are present
  allDays.forEach(day => {
    if (!completeHours[day]) {
      completeHours[day] = 'Closed';
    }
  });

  if (readOnly) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center">
          <span className="font-medium text-sm text-gray-700">Hours of Operation</span>
        </div>
        <div className="divide-y">
          {allDays.map(day => (
            <div key={day} className="flex justify-between items-center px-4 py-2 hover:bg-gray-50">
              <span className="capitalize font-medium text-gray-700">{day}</span>
              <span className={`${completeHours[day] === 'Closed' ? 'text-red-500' : 'text-green-600'}`}>
                {completeHours[day]}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allDays.map(day => {
        const hours = completeHours[day];
        const isOpen = hours !== 'Closed';
        const [openTime, closeTime] = isOpen ? hours.split(' - ') : ['9:00 AM', '5:00 PM'];
        
        return (
          <div key={day} className="border rounded-lg p-3 bg-white">
            <div className="flex justify-between items-center mb-2">
              <span className="capitalize text-sm font-medium">{day}:</span>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">{isOpen ? 'Open' : 'Closed'}</span>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isOpen ? 'bg-green-500' : 'bg-gray-200'}`}
                  onClick={() => {
                    // Toggle between open and closed
                    onChange(day, isOpen ? 'Closed' : `${openTime} - ${closeTime}`);
                  }}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOpen ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>
            </div>
            
            {isOpen && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Opening Time</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={openTime}
                    onChange={(e) => {
                      const newOpenTime = e.target.value;
                      onChange(day, `${newOpenTime} - ${closeTime}`);
                    }}
                  >
                    {[...Array(24)].map((_, i) => {
                      // Generate times for 12-hour clock
                      const hour = i % 12 || 12;
                      const period = i < 12 ? 'AM' : 'PM';
                      const time = `${hour}:00 ${period}`;
                      return (
                        <option key={`open-${i}`} value={time}>{time}</option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Closing Time</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={closeTime}
                    onChange={(e) => {
                      const newCloseTime = e.target.value;
                      onChange(day, `${openTime} - ${newCloseTime}`);
                    }}
                  >
                    {[...Array(24)].map((_, i) => {
                      // Generate times for 12-hour clock
                      const hour = i % 12 || 12;
                      const period = i < 12 ? 'AM' : 'PM';
                      const time = `${hour}:00 ${period}`;
                      return (
                        <option key={`close-${i}`} value={time}>{time}</option>
                      );
                    })}
                  </select>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 rounded">
        Toggle days to set as open or closed. For open days, select operating hours.
      </div>
    </div>
  );
};

export default BusinessHours; 