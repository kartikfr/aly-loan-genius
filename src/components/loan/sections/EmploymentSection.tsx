
import { useState, useEffect } from 'react';
import { useQuestionnaire } from '../QuestionnaireContext';
import { Search, Building } from 'lucide-react';

interface CompanyResult {
  id?: string;
  companyName?: string;
  name?: string;
}

export const EmploymentSection = () => {
  const { state, updateFormData } = useQuestionnaire();
  const { currentStep, formData, errors } = state;
  const [companySearch, setCompanySearch] = useState('');
  const [companyResults, setCompanyResults] = useState<CompanyResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Company search API integration
  useEffect(() => {
    const searchCompanies = async () => {
      // Trigger search after user types at least 1 character
      if (companySearch.trim().length >= 1) {
        setIsSearching(true);
        try {
          // Construct the API URL correctly - search term goes directly after companies/
          const apiUrl = `https://bk-prod-external.bankkaro.com/sp/api/companies/${encodeURIComponent(companySearch.trim())}?type=PL`;
          console.log('API URL:', apiUrl);
          
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            // Add mode to handle CORS
            mode: 'cors',
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Company API Response:', data);
            
            // Handle different response structures
            if (Array.isArray(data)) {
              setCompanyResults(data);
            } else if (data && typeof data === 'object') {
              // If response is object with company data under IDs
              const companies = Object.entries(data).map(([id, company]) => {
                if (typeof company === 'object' && company !== null) {
                  return { id, ...company } as CompanyResult;
                }
                return { id, companyName: String(company) } as CompanyResult;
              }).filter(company => company.companyName || company.name);
              
              console.log('Processed companies:', companies);
              setCompanyResults(companies);
            } else {
              setCompanyResults([]);
            }
          } else {
            console.error('API Error:', response.status, response.statusText);
            // For now, allow manual entry if API fails
            setCompanyResults([]);
          }
        } catch (error) {
          console.error('Company search error:', error);
          // If CORS or network error, allow manual entry
          setCompanyResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setCompanyResults([]);
        setIsSearching(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(searchCompanies, 300);
    return () => clearTimeout(timeoutId);
  }, [companySearch]);

  const renderQuestion = () => {
    switch (currentStep) {
      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
                What's your employment status?
              </h2>
              <p className="text-muted-foreground text-lg">
                This helps us find the right loan products for you
              </p>
            </div>
            
            <div className="space-y-4 max-w-lg mx-auto">
              {[
                { 
                  value: 'salaried', 
                  label: 'Salaried Employee', 
                  subtitle: 'Most loan options available',
                  icon: Building
                },
                { 
                  value: 'self_employed', 
                  label: 'Self-Employed/Business Owner', 
                  subtitle: 'Flexible documentation required'
                },
                { 
                  value: 'student', 
                  label: 'Student', 
                  subtitle: 'Education loan options available'
                }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData({ employmentStatus: option.value as any })}
                  className={`
                    radio-option text-left w-full flex items-center gap-4
                    ${formData.employmentStatus === option.value ? 'selected' : ''}
                  `}
                >
                  {option.icon && <option.icon className="h-6 w-6 text-primary" />}
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground mt-1">{option.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
            
            {errors.employmentStatus && (
              <p className="text-destructive text-sm text-center">{errors.employmentStatus}</p>
            )}
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
                Where do you work?
              </h2>
              <p className="text-muted-foreground text-lg">
                Start typing your company name
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={companySearch || formData.company_name}
                  onChange={(e) => {
                    setCompanySearch(e.target.value);
                    if (!e.target.value) {
                      updateFormData({ company_name: '' });
                    }
                  }}
                  placeholder="Start typing company name..."
                  className="form-input pl-12"
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              
              {/* Company search results */}
              {companyResults.length > 0 && (
                <div className="mt-2 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                  {companyResults.slice(0, 10).map((company, index) => (
                    <button
                      key={company.id || index}
                      onClick={() => {
                        const companyName = company.companyName || company.name || String(company);
                        updateFormData({ company_name: companyName });
                        setCompanySearch('');
                        setCompanyResults([]);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{company.companyName || company.name || String(company)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Show message if searching but no results */}
              {companySearch.length >= 1 && !isSearching && companyResults.length === 0 && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    No companies found. You can type your company name and continue.
                  </p>
                </div>
              )}
              
              {/* Selected company display */}
              {formData.company_name && !companySearch && (
                <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-primary" />
                    <span className="font-medium">{formData.company_name}</span>
                    <button
                      onClick={() => {
                        updateFormData({ company_name: '' });
                        setCompanySearch('');
                      }}
                      className="ml-auto text-primary hover:text-primary/80 text-sm"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}
              
              {errors.company_name && (
                <p className="text-destructive text-sm text-center mt-2">
                  {errors.company_name}
                </p>
              )}
              
              <p className="text-sm text-muted-foreground text-center mt-4">
                Can't find your company? Type the full name and we'll add it
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderQuestion();
};
