import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoanOffer, LoanTag } from '../lib/api';
import { LoanOfferCard } from '../components/loan/LoanOfferCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Filter, 
  SortAsc, 
  CheckCircle, 
  XCircle,
  Users,
  RefreshCw
} from 'lucide-react';

export const LoanOffers: React.FC = () => {
  const navigate = useNavigate();
  const [eligibleOffers, setEligibleOffers] = useState<LoanOffer[]>([]);
  const [ineligibleOffers, setIneligibleOffers] = useState<LoanOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recommended' | 'totalPayable' | 'loanAmount' | 'tenure' | 'interestRate' | 'processingFees'>('recommended');
  const [selectedLoanTypes, setSelectedLoanTypes] = useState<number[]>([]);
  const [availableLoanTypes, setAvailableLoanTypes] = useState<LoanTag[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [availableFeatures, setAvailableFeatures] = useState<LoanTag[]>([]);
  const [selectedLenderTypes, setSelectedLenderTypes] = useState<string[]>([]);
  const [availableLenderTypes, setAvailableLenderTypes] = useState<string[]>([]);

  useEffect(() => {
    // Load loan offers from localStorage (set by NavigationButtons after form submission)
    const loadLoanOffers = () => {
      try {
        const storedOffers = localStorage.getItem('loanOffers');
        const storedLeadInfo = localStorage.getItem('leadInfo');
        
        if (storedOffers) {
          const offersData = JSON.parse(storedOffers);
          console.log('📊 Loaded loan offers:', offersData);
          console.log('📊 Data type:', typeof offersData);
          console.log('📊 Is array:', Array.isArray(offersData));
          console.log('📊 Keys:', Object.keys(offersData || {}));
          
          // Debug: Log first offer to understand structure
          if (offersData && typeof offersData === 'object') {
            const firstEligible = offersData.offers?.[0] || offersData.isEligible?.[0] || offersData.data?.offers?.[0] || offersData.data?.isEligible?.[0];
            const firstIneligible = offersData.inEligibleOffers?.[0] || offersData.data?.inEligibleOffers?.[0];
            
            if (firstEligible) {
              console.log('📊 First eligible offer structure:', firstEligible);
              console.log('📊 Available fields:', Object.keys(firstEligible));
              console.log('📊 Monthly installment:', firstEligible.monthly_installment);
              console.log('📊 Total payable amount:', firstEligible.total_payable_amount);
              console.log('📊 Interest rate calculation fields:', {
                minimum_total_interest_paid: firstEligible.minimum_total_interest_paid,
                maximum_total_interest_paid: firstEligible.maximum_total_interest_paid,
                minimum_total_payable_amount_range: firstEligible.minimum_total_payable_amount_range,
                maximum_total_payable_amount_range: firstEligible.maximum_total_payable_amount_range
              });
              console.log('📊 Loan tags:', firstEligible.loan_tags || firstEligible.loan_tag);
            }
            
            if (firstIneligible) {
              console.log('📊 First ineligible offer structure:', firstIneligible);
              console.log('📊 Rejection reason:', firstIneligible.rejectedReason);
              console.log('📊 Boolean rejection flags:', {
                ageRejected: firstIneligible.ageRejected,
                salaryRejected: firstIneligible.salaryRejected,
                loanAmountRejected: firstIneligible.loanAmountRejected,
                employmentTypeRejected: firstIneligible.employmentTypeRejected,
                salaryModeRejected: firstIneligible.salaryModeRejected,
                pincodeReject: firstIneligible.pincodeReject,
                dedupeReject: firstIneligible.dedupeReject,
                creditScoreReject: firstIneligible.creditScoreReject,
                bre2CompanyCatReject: firstIneligible.bre2CompanyCatReject
              });
              console.log('📊 Available ineligible fields:', Object.keys(firstIneligible));
            }
          }
          
          // Handle different possible data structures from the API
          let eligibleArray = [];
          let ineligibleArray = [];
          
          // Check for the actual API structure where eligible offers are in 'offers' array
          if (offersData.offers && Array.isArray(offersData.offers)) {
            eligibleArray = offersData.offers;
            console.log('📊 Found offers in "offers" array:', eligibleArray.length);
          } 
          // Fallback to previous structure
          else if (offersData.isEligible && Array.isArray(offersData.isEligible)) {
            eligibleArray = offersData.isEligible;
            console.log('📊 Found offers in "isEligible" array:', eligibleArray.length);
          } else if (offersData.data && offersData.data.isEligible && Array.isArray(offersData.data.isEligible)) {
            eligibleArray = offersData.data.isEligible;
            console.log('📊 Found offers in "data.isEligible" array:', eligibleArray.length);
          } else if (offersData.data && offersData.data.offers && Array.isArray(offersData.data.offers)) {
            eligibleArray = offersData.data.offers;
            console.log('📊 Found offers in "data.offers" array:', eligibleArray.length);
          }
          
          // Handle ineligible offers
          if (offersData.inEligibleOffers && Array.isArray(offersData.inEligibleOffers)) {
            ineligibleArray = offersData.inEligibleOffers;
            console.log('📊 Found ineligible offers:', ineligibleArray.length);
          } else if (offersData.data && offersData.data.inEligibleOffers && Array.isArray(offersData.data.inEligibleOffers)) {
            ineligibleArray = offersData.data.inEligibleOffers;
            console.log('📊 Found ineligible offers in data:', ineligibleArray.length);
          }
          
          console.log('✅ Eligible offers:', eligibleArray.length);
          console.log('✅ Ineligible offers:', ineligibleArray.length);
          
          setEligibleOffers(eligibleArray);
          setIneligibleOffers(ineligibleArray);
          
          // Extract unique loan types and features from all offers
          extractLoanTypesAndFeatures([...eligibleArray, ...ineligibleArray]);
        } else {
          // No stored offers found - redirect to questionnaire
          console.log('⚠️ No stored offers found, redirecting to questionnaire');
          setEligibleOffers([]);
          setIneligibleOffers([]);
          // Optionally redirect to questionnaire or show empty state
          // navigate('/loan-questionnaire');
        }
      } catch (error) {
        console.error('❌ Error loading loan offers:', error);
        console.error('❌ Error details:', error);
        // Show error state instead of mock data
        setEligibleOffers([]);
        setIneligibleOffers([]);
      } finally {
        setLoading(false);
      }
    };

    loadLoanOffers();
  }, []);

  // Extract unique loan types, features, and lender types from offers
  const extractLoanTypesAndFeatures = (offers: LoanOffer[]) => {
    const loanTypesMap = new Map<number, LoanTag>();
    const featuresMap = new Map<number, LoanTag>();
    const lenderTypesSet = new Set<string>();
    
    offers.forEach(offer => {
      // Extract loan tags (features)
      if (offer.loan_tags && Array.isArray(offer.loan_tags)) {
        offer.loan_tags.forEach(tag => {
          if (tag.id && tag.name) {
            featuresMap.set(tag.id, tag);
          }
        });
      }
      // Also check for loan_tag (backward compatibility)
      else if (offer.loan_tag && Array.isArray(offer.loan_tag)) {
        offer.loan_tag.forEach(tag => {
          if (tag.id && tag.name) {
            featuresMap.set(tag.id, tag);
          }
        });
      }
      
      // Extract lender categories/types
      if (offer.lender_category) {
        lenderTypesSet.add(offer.lender_category);
      }
    });
    
    const uniqueFeatures = Array.from(featuresMap.values());
    const uniqueLenderTypes = Array.from(lenderTypesSet);
    
    // Keep loan types for backward compatibility
    setAvailableLoanTypes(uniqueFeatures);
    setAvailableFeatures(uniqueFeatures);
    setAvailableLenderTypes(uniqueLenderTypes);
    
    console.log('📋 Available features:', uniqueFeatures);
    console.log('📋 Available lender types:', uniqueLenderTypes);
  };

  // Filter offers by selected features and lender types
  const filterOffers = (offers: LoanOffer[]) => {
    let filteredOffers = offers;
    
    // Filter by features
    if (selectedFeatures.length > 0) {
      filteredOffers = filteredOffers.filter(offer => {
        const offerTags = offer.loan_tags || offer.loan_tag || [];
        if (!Array.isArray(offerTags)) return false;
        
        // Check if offer has any of the selected feature IDs
        return offerTags.some(tag => selectedFeatures.includes(tag.id));
      });
    }
    
    // Filter by lender types
    if (selectedLenderTypes.length > 0) {
      filteredOffers = filteredOffers.filter(offer => 
        selectedLenderTypes.includes(offer.lender_category)
      );
    }
    
    return filteredOffers;
  };

  // Filter offers by selected loan types (backward compatibility)
  const filterOffersByLoanType = (offers: LoanOffer[]) => {
    if (selectedLoanTypes.length === 0) {
      return offers; // Show all if no filters selected
    }
    
    return offers.filter(offer => {
      const offerTags = offer.loan_tags || offer.loan_tag || [];
      if (!Array.isArray(offerTags)) return false;
      
      // Check if offer has any of the selected loan type IDs
      return offerTags.some(tag => selectedLoanTypes.includes(tag.id));
    });
  };

  // Handle feature filter toggle
  const toggleFeature = (featureId: number) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  // Handle lender type filter toggle
  const toggleLenderType = (lenderType: string) => {
    setSelectedLenderTypes(prev => 
      prev.includes(lenderType)
        ? prev.filter(type => type !== lenderType)
        : [...prev, lenderType]
    );
  };

  // Handle loan type filter toggle (backward compatibility)
  const toggleLoanType = (loanTypeId: number) => {
    setSelectedLoanTypes(prev => 
      prev.includes(loanTypeId)
        ? prev.filter(id => id !== loanTypeId)
        : [...prev, loanTypeId]
    );
  };



  const sortOffers = (offers: LoanOffer[]) => {
    // Ensure offers is an array and has valid data
    if (!offers || !Array.isArray(offers) || offers.length === 0) {
      return [];
    }
    
    return [...offers].sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (sortBy) {
        case 'recommended':
          // Keep original order (recommended by API)
          return 0;
        case 'totalPayable':
          aValue = parseFloat(a.total_payable_amount?.toString() || '0');
          bValue = parseFloat(b.total_payable_amount?.toString() || '0');
          return aValue - bValue; // Lowest to Highest
        case 'loanAmount':
          aValue = parseFloat(a.loan_offered_upto?.toString() || '0');
          bValue = parseFloat(b.loan_offered_upto?.toString() || '0');
          return bValue - aValue; // Highest to Lowest
        case 'tenure':
          aValue = parseFloat(a.maximum_loan_tenure?.toString() || '0');
          bValue = parseFloat(b.maximum_loan_tenure?.toString() || '0');
          return bValue - aValue; // Longest to Shortest
        case 'interestRate':
          aValue = parseFloat(a.minimum_interest_rate?.toString() || '999');
          bValue = parseFloat(b.minimum_interest_rate?.toString() || '999');
          return aValue - bValue; // Lowest to Highest
        case 'processingFees':
          aValue = parseFloat(a.processingFees?.toString().replace(/[^\d.]/g, '') || '0');
          bValue = parseFloat(b.processingFees?.toString().replace(/[^\d.]/g, '') || '0');
          return aValue - bValue; // Lowest to Highest
        default:
          return 0;
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Finding Your Best Loan Offers</h2>
          <p className="text-gray-600">Please wait while we analyze your profile...</p>
        </div>
      </div>
    );
  }

  // Apply filters and sorting
  const filteredEligibleOffers = filterOffers(eligibleOffers || []);
  const filteredIneligibleOffers = filterOffers(ineligibleOffers || []);
  
  const totalOffers = (filteredEligibleOffers?.length || 0) + (filteredIneligibleOffers?.length || 0);
  const sortedEligibleOffers = sortOffers(filteredEligibleOffers);
  const sortedIneligibleOffers = sortOffers(filteredIneligibleOffers);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button & Title */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Loan Offers</h1>
                <p className="text-sm text-gray-600">
                  Showing {totalOffers} loan options for you
                </p>
              </div>
            </div>

            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filters */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h3>
            
            {/* Mobile Sort Filter */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <SortAsc className="w-4 h-4 mr-2 text-blue-600" />
                SORT BY
              </h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'recommended' | 'totalPayable' | 'loanAmount' | 'tenure' | 'interestRate' | 'processingFees')}
                  className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="recommended">Recommended</option>
                  <option value="totalPayable">Total Payable Amount (Lowest to Highest)</option>
                  <option value="loanAmount">Loan Amount (Highest to Lowest)</option>
                  <option value="tenure">Tenure (Longest to Shortest)</option>
                  <option value="interestRate">Interest Rate (Lowest to Highest)</option>
                  <option value="processingFees">Processing Fees (Lowest to Highest)</option>
                </select>
              </div>
            </div>
            
            {/* Mobile Features */}
            {availableFeatures.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">FEATURES</h4>
                <div className="flex flex-wrap gap-2">
                  {availableFeatures.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`
                        px-3 py-2 rounded-lg border-2 font-medium text-xs transition-all duration-200
                        ${selectedFeatures.includes(feature.id)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                        }
                      `}
                    >
                      {feature.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Lender Types */}
            {availableLenderTypes.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">LENDER TYPE</h4>
                <div className="flex flex-wrap gap-2">
                  {availableLenderTypes.map((lenderType) => (
                    <button
                      key={lenderType}
                      onClick={() => toggleLenderType(lenderType)}
                      className={`
                        px-3 py-2 rounded-lg border-2 font-medium text-xs transition-all duration-200
                        ${selectedLenderTypes.includes(lenderType)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                        }
                      `}
                    >
                      {lenderType === 'STPL' ? 'STPL' : lenderType}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Clear All */}
            {(selectedFeatures.length > 0 || selectedLenderTypes.length > 0) && (
              <button
                onClick={() => {
                  setSelectedFeatures([]);
                  setSelectedLenderTypes([]);
                }}
                className="px-3 py-2 rounded-lg border-2 border-red-300 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition-all duration-200"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            {/* Enhanced Filters */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-24">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h3>

                {/* Sort Section */}
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 bg-gray-50 px-3 py-2 rounded flex items-center">
                    <SortAsc className="w-4 h-4 mr-2 text-blue-600" />
                    SORT BY
                  </h4>
                  <div className="space-y-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'recommended' | 'totalPayable' | 'loanAmount' | 'tenure' | 'interestRate' | 'processingFees')}
                      className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="totalPayable">Total Payable Amount (Lowest to Highest)</option>
                      <option value="loanAmount">Loan Amount (Highest to Lowest)</option>
                      <option value="tenure">Tenure (Longest to Shortest)</option>
                      <option value="interestRate">Interest Rate (Lowest to Highest)</option>
                      <option value="processingFees">Processing Fees (Lowest to Highest)</option>
                    </select>
                  </div>
                </div>

                {/* Features Section */}
                {availableFeatures.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 bg-gray-50 px-3 py-2 rounded">
                      FEATURES
                    </h4>
                    <div className="space-y-3">
                      {availableFeatures.map((feature) => (
                        <label key={feature.id} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFeatures.includes(feature.id)}
                            onChange={() => toggleFeature(feature.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                            {feature.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lender Type Section */}
                {availableLenderTypes.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 bg-gray-50 px-3 py-2 rounded">
                      LENDER TYPE
                    </h4>
                    <div className="space-y-3">
                      {availableLenderTypes.map((lenderType) => (
                        <label key={lenderType} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedLenderTypes.includes(lenderType)}
                            onChange={() => toggleLenderType(lenderType)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                            {lenderType === 'STPL' ? 'Short Term Personal Loans (STPL)' : 
                             lenderType === 'Banks' ? 'Banks' : 
                             lenderType === 'NBFCs' ? 'Non-Banking Financial Companies (NBFCs)' : 
                             lenderType}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear All Filters */}
                {(selectedFeatures.length > 0 || selectedLenderTypes.length > 0) && (
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setSelectedFeatures([]);
                        setSelectedLenderTypes([]);
                      }}
                      className="w-full px-4 py-3 rounded-lg border-2 border-red-300 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition-all duration-200"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}

                {/* Active Filters Display */}
                {(selectedFeatures.length > 0 || selectedLenderTypes.length > 0) && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 mb-2">Active Filters:</div>
                    <div className="space-y-1">
                      {selectedFeatures.length > 0 && (
                        <div className="text-xs text-blue-700">
                          <span className="font-medium">Features: </span>
                          {selectedFeatures.map(id => 
                            availableFeatures.find(feature => feature.id === id)?.name
                          ).filter(Boolean).join(', ')}
                        </div>
                      )}
                      {selectedLenderTypes.length > 0 && (
                        <div className="text-xs text-blue-700">
                          <span className="font-medium">Lender Types: </span>
                          {selectedLenderTypes.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>


          </div>

          {/* Right Content - Loan Offers */}
          <div className="flex-1 min-w-0">
            {/* Eligible Offers Section */}
            {sortedEligibleOffers.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold text-gray-900">Eligible Loan Offers</h2>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {sortedEligibleOffers.length} Available
                    </Badge>
                    {selectedLoanTypes.length > 0 && (
                      <Badge variant="outline" className="border-blue-200 text-blue-600">
                        Filtered
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Horizontal Scrollable Cards */}
                <div className="space-y-4">
                  {sortedEligibleOffers.map((offer, index) => (
                    <LoanOfferCard
                      key={offer.lender_id}
                      offer={offer}
                      isEligible={true}
                      rank={index + 1}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Ineligible Offers Section */}
            {sortedIneligibleOffers.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold text-gray-900">Other Available Offers</h2>
                    <Badge variant="outline" className="border-gray-300 text-gray-600">
                      {sortedIneligibleOffers.length} Not Eligible
                    </Badge>
                    {selectedLoanTypes.length > 0 && (
                      <Badge variant="outline" className="border-blue-200 text-blue-600">
                        Filtered
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  You may become eligible for these offers by improving your profile
                </p>

                {/* Horizontal Scrollable Cards */}
                <div className="space-y-4">
                  {sortedIneligibleOffers.map((offer) => (
                    <LoanOfferCard
                      key={offer.lender_id}
                      offer={offer}
                      isEligible={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* No Offers Message */}
        {eligibleOffers.length === 0 && ineligibleOffers.length === 0 && (
          <div className="text-center py-16">
            <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Loan Offers Available</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any loan offers matching your profile at the moment.
            </p>
            <Button 
              onClick={() => navigate('/questionnaire')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Your Information
            </Button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mr-4"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => navigate('/questionnaire')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Apply for Another Loan
          </Button>
        </div>
      </div>
    </div>
  );
};