import React, { useState, useEffect } from 'react';
import { MapPin, Loader } from 'lucide-react';
import { apiService } from '@/lib/api';

interface PincodeSearchProps {
  value: string;
  onChange: (pincode: string, city: string, state: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

export const PincodeSearch: React.FC<PincodeSearchProps> = ({
  value,
  onChange,
  placeholder = "Enter 6-digit pincode",
  label = "Pincode *",
  error
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [locationInfo, setLocationInfo] = useState({ city: '', state: '' });

  const searchPincode = async (pincode: string) => {
    if (pincode.length !== 6) {
      setLocationInfo({ city: '', state: '' });
      return;
    }

    setIsLoading(true);
    setPincodeError('');
    
    try {
      const response = await apiService.searchPincode(pincode);
      
      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        const city = location.city;
        const state = location.state;
        
        setLocationInfo({ city, state });
        onChange(pincode, city, state);
      } else {
        setPincodeError('Invalid pincode');
        setLocationInfo({ city: '', state: '' });
      }
    } catch (error) {
      console.error('Failed to search pincode:', error);
      setPincodeError('Failed to validate pincode');
      setLocationInfo({ city: '', state: '' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pincode = e.target.value.replace(/\D/g, '').slice(0, 6);
    
    // Update parent with pincode only, city and state will be updated after validation
    onChange(pincode, '', '');
    
    if (pincode.length === 6) {
      searchPincode(pincode);
    } else {
      setLocationInfo({ city: '', state: '' });
      setPincodeError('');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          maxLength={6}
          className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error || pincodeError ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isLoading && (
            <Loader className="h-5 w-5 text-blue-600 animate-spin" />
          )}
        </div>
      </div>

      {(error || pincodeError) && (
        <p className="mt-1 text-sm text-red-600">{error || pincodeError}</p>
      )}

      {locationInfo.city && locationInfo.state && (
        <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center text-sm text-green-800">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{locationInfo.city}, {locationInfo.state}</span>
          </div>
        </div>
      )}
    </div>
  );
};