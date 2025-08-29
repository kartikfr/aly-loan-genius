import React, { useState, useEffect, useRef } from 'react';
import { Search, Building, ChevronDown } from 'lucide-react';
import { apiService } from '@/lib/api';

interface CompanySearchProps {
  value: string;
  onChange: (companyName: string) => void;
  placeholder?: string;
  error?: string;
}

interface Company {
  id: number;
  companyName: string;
}

export const CompanySearch: React.FC<CompanySearchProps> = ({
  value,
  onChange,
  placeholder = "Search for your company...",
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const debounceRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchCompanies = async (query: string) => {
    if (query.length < 2) {
      setCompanies([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.searchCompanies(query);
      setCompanies(response.data || []);
    } catch (error) {
      console.error('Failed to search companies:', error);
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    setIsOpen(true);

    // Debounce the search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchCompanies(query);
    }, 300);
  };

  const handleCompanySelect = (company: Company) => {
    setSearchTerm(company.companyName);
    onChange(company.companyName);
    setIsOpen(false);
  };

  const handleOtherSelect = () => {
    setSearchTerm("Other");
    onChange("Other");
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (searchTerm.length >= 2) {
      searchCompanies(searchTerm);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Company Name *
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Building className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          ) : (
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {isOpen && companies.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-hidden">
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {/* Show API search results */}
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => handleCompanySelect(company)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors duration-150"
              >
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-900 truncate">{company.companyName}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && searchTerm.length >= 2 && companies.length === 0 && !isLoading && searchTerm !== "Other" && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-hidden">
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {/* Show "Other" option when no companies found */}
            <button
              onClick={handleOtherSelect}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 transition-colors duration-150"
            >
              <div className="flex items-center">
                <Building className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                <div>
                  <span className="text-gray-900 font-medium">Other</span>
                  <div className="text-xs text-gray-500">Self-employed / Company not listed</div>
                </div>
              </div>
            </button>
            
            {/* No results message */}
            <div className="px-4 py-3 text-center text-gray-500">
              <div className="text-sm">No companies found for "{searchTerm}"</div>
              <div className="text-xs mt-1 text-gray-400">Try different keywords or select "Other" above</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};