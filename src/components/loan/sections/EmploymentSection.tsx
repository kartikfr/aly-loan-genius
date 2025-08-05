import { useState, useEffect } from 'react';
import { useQuestionnaire } from '../QuestionnaireContext';
import { Search, Building } from 'lucide-react';

export const EmploymentSection = () => {
  const { state, updateFormData } = useQuestionnaire();
  const { currentStep, formData, errors } = state;
  const [companySearch, setCompanySearch] = useState('');
  const [companyResults, setCompanyResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Company search API integration
  useEffect(() => {
    const searchCompanies = async () => {
      if (companySearch.length >= 3) {
        setIsSearching(true);
        try {
          const response = await fetch(
            `https://bk-prod-external.bankkaro.com/sp/api/companies/${encodeURIComponent(companySearch)}?type=PL`
          );
          if (response.ok) {
            const data = await response.json();
            setCompanyResults(data || []);
          }
        } catch (error) {
          console.error('Company search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setCompanyResults([]);
      }
    };

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
                <div className="mt-2 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {companyResults.slice(0, 10).map((company, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        updateFormData({ company_name: company.name || company });
                        setCompanySearch('');
                        setCompanyResults([]);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{company.name || company}</span>
                      </div>
                    </button>
                  ))}
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