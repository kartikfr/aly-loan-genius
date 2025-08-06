import React, { useState } from 'react';
import { LoanOffer } from '../../lib/api';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { 
  ExternalLink,
  X,
  AlertCircle,
  Info
} from 'lucide-react';

interface LoanOfferCardProps {
  offer: LoanOffer;
  isEligible: boolean;
  rank?: number;
}

export const LoanOfferCard: React.FC<LoanOfferCardProps> = ({ 
  offer, 
  isEligible, 
  rank 
}) => {
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showInterestRateModal, setShowInterestRateModal] = useState(false);

  // Global click handler to close all tooltips
  React.useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-tooltip]')) {
        // Close all tooltips when clicking outside
        const allTooltips = document.querySelectorAll('[data-tooltip]');
        allTooltips.forEach(tooltip => {
          tooltip.dispatchEvent(new Event('mouseleave', { bubbles: true }));
        });
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);
  const formatAmount = (amount: string | number | undefined) => {
    if (!amount) return 'N/A';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return 'N/A';
    
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    } else if (num >= 1000) {
      return `₹${(num / 1000).toFixed(0)}K`;
    }
    return `₹${num.toLocaleString()}`;
  };

  const formatInterestRate = (min?: string | number, max?: string | number) => {
    if (!min && !max) return 'Rate varies';
    if (!max) return `${min}%`;
    return `${min}% - ${max}%`;
  };

  const formatTenure = (tenure?: string | number) => {
    if (!tenure) return 'Flexible';
    const months = typeof tenure === 'string' ? parseInt(tenure) : tenure;
    if (isNaN(months)) return 'Flexible';
    
    if (months >= 12) {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths === 0) {
        return `${years} Year${years > 1 ? 's' : ''}`;
      } else {
        return `${years}Y ${remainingMonths}M`;
      }
    }
    return `${months} Months`;
  };

  const formatAmountDetailed = (amount: string | number | undefined) => {
    if (!amount) return 'N/A';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return 'N/A';
    return `₹${num.toLocaleString()}`;
  };

  const formatSingleInterestRate = (rate?: string | number) => {
    if (!rate) return 'Rate varies';
    return `${rate}%`;
  };

  const translateRejectionReason = (rejectedReason?: string, offer?: LoanOffer): string => {
    if (!offer) return 'Eligibility criteria not met';
    
    // Check specific boolean rejection flags first (more accurate)
    const rejectionReasons = [];
    
    if (offer.ageRejected === true) {
      rejectionReasons.push('You do not meet the age criteria for this lender. Your age is outside their acceptable range.');
    }
    
    if (offer.salaryRejected === true) {
      rejectionReasons.push('Your salary does not meet the minimum income requirements for this lender. They require a higher monthly income.');
    }
    
    if (offer.loanAmountRejected === true) {
      rejectionReasons.push('The requested loan amount is not supported by this lender. It may be too high or too low for their lending range.');
    }
    
    if (offer.employmentTypeRejected === true) {
      rejectionReasons.push('Your employment type does not meet the lender\'s criteria. They may not accept your current job category or employment status.');
    }
    
    if (offer.salaryModeRejected === true) {
      rejectionReasons.push('Your salary payment method (cash/bank transfer) does not meet the lender\'s requirements. They may require bank salary credits.');
    }
    
    if (offer.pincodeReject === true) {
      rejectionReasons.push('You are rejected because the lender is not serviceable at your pincode. This lender does not provide loans in your area.');
    }
    
    if (offer.dedupeReject === true) {
      rejectionReasons.push('You have already applied with this lender recently or have an existing application. They don\'t allow duplicate applications.');
    }
    
    if (offer.creditScoreReject === true) {
      rejectionReasons.push('Your credit score does not meet the lender\'s requirements. They need a higher credit score for loan approval.');
    }
    
    if (offer.bre2CompanyCatReject === true) {
      rejectionReasons.push('You are rejected due to the lender\'s internal company policy. Your profile does not match their current lending criteria.');
    }
    
    // If we have specific boolean reasons, use them
    if (rejectionReasons.length > 0) {
      return rejectionReasons.join(' ');
    }
    
    // Fallback to text-based parsing if boolean flags are not available
    if (!rejectedReason) return 'Eligibility criteria not met';
    
    const lowerReason = rejectedReason.toLowerCase();
    
    // Pincode/Location specific rejections
    if (lowerReason.includes('bre rejected at pincode') || 
        (lowerReason.includes('pincode') && lowerReason.includes('office_pincode'))) {
      return 'You are rejected because the lender is not serviceable at your pincode. This lender does not provide loans in your area.';
    }
    
    // General pincode/location rejection
    if (lowerReason.includes('pincode') || lowerReason.includes('office_pincode') || lowerReason.includes('location')) {
      return 'Service not available at your location. This lender does not operate in your area.';
    }
    
    // Company policy rejection (BRE 2)
    if (lowerReason.includes('bre 2 rejected') || lowerReason.includes('company rejected')) {
      return 'You are rejected due to the lender\'s internal company policy. Your profile does not match their current lending criteria.';
    }
    
    // General BRE (Business Rules Engine) rejections
    if (lowerReason.includes('bre rejected') || lowerReason.includes('bre 1 rejected')) {
      return 'You do not meet the lender\'s eligibility criteria. This could be due to income, employment, or credit requirements.';
    }
    
    // Income related rejections
    if (lowerReason.includes('income') || lowerReason.includes('salary') || lowerReason.includes('monthly income')) {
      return 'Your income does not meet the minimum requirements for this lender. They require a higher monthly income.';
    }
    
    // Credit score related rejections
    if (lowerReason.includes('credit') || lowerReason.includes('cibil') || lowerReason.includes('credit score')) {
      return 'Your credit score does not meet the lender\'s requirements. They need a higher credit score for loan approval.';
    }
    
    // Age related rejections
    if (lowerReason.includes('age') || lowerReason.includes('too young') || lowerReason.includes('too old')) {
      return 'You do not meet the age criteria for this lender. Your age is outside their acceptable range.';
    }
    
    // Employment related rejections
    if (lowerReason.includes('employment') || lowerReason.includes('job') || lowerReason.includes('work experience')) {
      return 'Your employment details do not meet the lender\'s criteria. They may require different job type or work experience.';
    }
    
    // Loan amount related rejections
    if (lowerReason.includes('loan amount') || lowerReason.includes('amount too high') || lowerReason.includes('amount too low')) {
      return 'The requested loan amount is not supported by this lender. It may be too high or too low for their lending range.';
    }
    
    // Generic fallback with more helpful message
    return 'You do not meet this lender\'s eligibility criteria. This could be due to various factors like income, credit score, location, or employment details.';
  };

  const getActionSuggestion = (reason?: string, offer?: LoanOffer): string => {
    if (!offer) return 'Try other lenders that may have different eligibility criteria.';
    
    // Check specific boolean rejection flags for targeted suggestions
    const suggestions = [];
    
    if (offer.ageRejected === true) {
      suggestions.push('Try other lenders with different age criteria, or consider adding a co-applicant within the acceptable age range.');
    }
    
    if (offer.salaryRejected === true) {
      suggestions.push('Consider applying for a smaller loan amount, try lenders with lower income requirements, or wait to increase your income before reapplying.');
    }
    
    if (offer.loanAmountRejected === true) {
      suggestions.push('Try adjusting your loan amount to fit within this lender\'s range, or explore other lenders with different amount criteria.');
    }
    
    if (offer.employmentTypeRejected === true) {
      suggestions.push('Try lenders who accept your employment type, or consider lenders that work with freelancers, self-employed, or different job categories.');
    }
    
    if (offer.salaryModeRejected === true) {
      suggestions.push('Try lenders who accept cash salary or different payment modes, or consider switching to bank salary credits if possible.');
    }
    
    if (offer.pincodeReject === true) {
      suggestions.push('Try other lenders who service your area, or consider lenders with wider geographical coverage.');
    }
    
    if (offer.dedupeReject === true) {
      suggestions.push('Wait for your existing application to be processed, or try other lenders where you haven\'t applied recently.');
    }
    
    if (offer.creditScoreReject === true) {
      suggestions.push('Work on improving your credit score by paying bills on time, reducing debt, and checking your credit report for errors. Try lenders who accept lower credit scores.');
    }
    
    if (offer.bre2CompanyCatReject === true) {
      suggestions.push('Try other lenders with different company policies, or work on improving your overall profile to meet their criteria.');
    }
    
    // If we have specific suggestions, use them
    if (suggestions.length > 0) {
      return suggestions.join(' ');
    }
    
    // Fallback to text-based suggestions if boolean flags are not available
    if (!reason) return 'Try other lenders that may have different eligibility criteria.';
    
    const lowerReason = reason.toLowerCase();
    
    // Pincode/Location suggestions
    if (lowerReason.includes('pincode') || lowerReason.includes('office_pincode') || lowerReason.includes('location')) {
      return 'Try other lenders who service your area, or consider lenders with wider geographical coverage.';
    }
    
    // Income related suggestions
    if (lowerReason.includes('income') || lowerReason.includes('salary')) {
      return 'Consider applying for a smaller loan amount, or try lenders with lower income requirements. You can also wait to increase your income before reapplying.';
    }
    
    // Credit score suggestions
    if (lowerReason.includes('credit') || lowerReason.includes('cibil')) {
      return 'Work on improving your credit score by paying bills on time, reducing debt, and checking your credit report for errors. Try lenders who accept lower credit scores.';
    }
    
    // Age related suggestions
    if (lowerReason.includes('age')) {
      return 'Try other lenders with different age criteria, or consider co-applicant options if available.';
    }
    
    // Employment suggestions
    if (lowerReason.includes('employment') || lowerReason.includes('job')) {
      return 'Try lenders who accept your employment type, or consider improving your work experience. Some lenders accept freelancers or different job categories.';
    }
    
    // Loan amount suggestions
    if (lowerReason.includes('loan amount') || lowerReason.includes('amount')) {
      return 'Try adjusting your loan amount to fit within this lender\'s range, or explore other lenders with different amount criteria.';
    }
    
    // Generic suggestion
    return 'Try other lenders with different eligibility criteria, or work on improving your profile (income, credit score, employment) before reapplying.';
  };

  const getInfoTooltip = (field: string): string => {
    switch (field) {
      case 'interestRate':
        return 'The annual percentage rate charged on your loan. Lower rates mean you pay less interest over time.';
      case 'monthlyInstallment':
        return 'The fixed amount you need to pay every month to repay this loan, including principal and interest.';
      case 'totalPayableAmount':
        return 'The total amount you will pay back over the entire loan tenure, including the principal amount and all interest charges.';
      case 'processingFee':
        return 'One-time fee charged by the lender for processing your loan application and documentation.';
      case 'loanAmount':
        return 'The maximum loan amount this lender can offer you based on your profile and their criteria.';
      case 'tenure':
        return 'The maximum time period (in months) over which you can repay this loan.';
      default:
        return 'Additional information about this loan feature.';
    }
  };

  const InfoButton: React.FC<{ field: string; className?: string }> = ({ field, className = "" }) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number; direction: 'top' | 'bottom' }>({ x: 0, y: 0, direction: 'top' });
    
    const handleMouseEnter = (e: React.MouseEvent) => {
      // Hide all other tooltips first
      const allTooltips = document.querySelectorAll('[data-tooltip]');
      allTooltips.forEach(tooltip => {
        if (tooltip !== e.currentTarget) {
          tooltip.dispatchEvent(new Event('mouseleave', { bubbles: true }));
        }
      });
      
      const rect = e.currentTarget.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate if tooltip would be cut off
      const tooltipWidth = 192; // w-48 = 12rem = 192px
      const tooltipHeight = 80; // Approximate height
      const margin = 8;
      
      let x = rect.left + rect.width / 2;
      let y = rect.top;
      let direction: 'top' | 'bottom' = 'top';
      
      // Check if tooltip would go off the right edge
      if (x + tooltipWidth / 2 > windowWidth - margin) {
        x = windowWidth - tooltipWidth / 2 - margin;
      }
      
      // Check if tooltip would go off the left edge
      if (x - tooltipWidth / 2 < margin) {
        x = tooltipWidth / 2 + margin;
      }
      
      // Check if tooltip would go off the top edge
      if (y - tooltipHeight - margin < 0) {
        direction = 'bottom';
        y = rect.bottom + tooltipHeight + margin;
      } else {
        y = y - tooltipHeight - margin;
      }
      
      setTooltipPosition({ x, y, direction });
      setIsTooltipVisible(true);
    };
    
    const handleMouseLeave = () => {
      setIsTooltipVisible(false);
    };
    
    return (
      <div className="relative inline-block">
        <button
          data-tooltip
          className={`text-gray-400 hover:text-gray-600 transition-colors ${className}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => {
            e.stopPropagation();
            setIsTooltipVisible(!isTooltipVisible);
          }}
        >
          <Info className="w-3 h-3" />
        </button>
        {isTooltipVisible && (
          <div 
            className="fixed z-[9999] px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg w-48 text-center max-w-xs"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: 'translateX(-50%)'
            }}
          >
            {getInfoTooltip(field)}
            <div 
              className={`absolute border-4 border-transparent ${
                tooltipPosition.direction === 'top' 
                  ? 'top-full border-t-gray-900' 
                  : 'bottom-full border-b-gray-900'
              }`}
              style={{ left: '50%', transform: 'translateX(-50%)' }}
            ></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Outer Badges - Positioned outside the card */}
      <div className="absolute -top-2 -right-2 z-20 flex gap-2">
        {offer.loan_tags && offer.loan_tags.length > 0 && (
          <>
            {offer.loan_tags.find(tag => tag.name.toLowerCase().includes('instant')) && (
              <Badge className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg border-2 border-white font-semibold tracking-wide">
                INSTANT
              </Badge>
            )}
            {isEligible && rank && rank <= 3 && (
              <Badge className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg border-2 border-white font-semibold tracking-wide">
                #{rank} PICK
              </Badge>
            )}
          </>
        )}
      </div>

      <Card className={`
        relative overflow-hidden transition-all duration-300 hover:shadow-lg w-full
        ${isEligible 
          ? 'border-primary/20 bg-gradient-to-r from-white to-blue-50/30 hover:shadow-xl hover:border-primary/40' 
          : 'border-gray-200 bg-white opacity-75'
        }
      `}>

      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Lender Logo */}
            <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
              {offer.lender_image ? (
                <img 
                  src={offer.lender_image} 
                  alt={offer.lender_name}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="text-lg font-bold text-gray-600">${offer.lender_name.charAt(0)}</div>`;
                    }
                  }}
                />
              ) : (
                <div className="text-lg font-bold text-gray-600">
                  {offer.lender_name.charAt(0)}
                </div>
              )}
            </div>

            {/* Lender Info */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {offer.lender_name}
              </h3>
                             <p className="text-gray-600 text-sm flex items-center gap-2 flex-wrap pr-8">
                 <span>Upto {offer.loan_offered_upto ? formatAmount(offer.loan_offered_upto) : (offer.max_loan_allowed ? formatAmount(offer.max_loan_allowed) : 'Amount varies')}</span>
                 <InfoButton field="loanAmount" />
                 <span>• {formatTenure(offer.maximum_loan_tenure)}</span>
                 <InfoButton field="tenure" />
               </p>
            </div>
          </div>

          {/* Action Button - Smaller and positioned in header */}
          <div>
            {isEligible ? (
              <Button 
                size="sm"
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-md"
                onClick={() => {
                  if (offer.apply_url) {
                    window.open(offer.apply_url, '_blank');
                  } else {
                    console.log('Apply for loan:', {
                      lender_id: offer.lender_id,
                      offer_id: offer.offer_id,
                      lender_name: offer.lender_name
                    });
                    alert(`Redirecting to ${offer.lender_name} application...`);
                  }
                }}
              >
                Apply
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                className="px-4 py-2 border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => setShowRejectionModal(true)}
              >
                See Why
              </Button>
            )}
          </div>
        </div>

        {/* Breakdown Section */}
        <div className={`space-y-4 rounded-lg p-4 overflow-hidden ${
          isEligible ? 'bg-gray-50/50' : 'bg-red-50/30 border border-red-100'
        }`}>
                     {/* Interest Rate */}
           <div className="flex justify-between items-center">
             <div className="flex items-center gap-2 pr-4">
               <span className="text-gray-600 text-sm font-medium">Interest Rate</span>
               <InfoButton field="interestRate" />
             </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-semibold ${isEligible ? 'text-gray-900' : 'text-gray-500'}`}>
                {offer.minimum_interest_rate && offer.maximum_interest_rate 
                  ? formatInterestRate(offer.minimum_interest_rate, offer.maximum_interest_rate)
                  : formatSingleInterestRate(offer.minimum_interest_rate || offer.maximum_interest_rate)
                }
              </span>
              {offer.minimum_interest_rate && offer.maximum_interest_rate && (
                <button
                  onClick={() => setShowInterestRateModal(true)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="View detailed calculation"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

                     {/* Monthly Installments */}
           <div className="flex justify-between items-center">
             <div className="flex items-center gap-2 pr-4">
               <span className="text-gray-600 text-sm font-medium">Monthly Installments</span>
               <InfoButton field="monthlyInstallment" />
             </div>
            <span className={`text-lg font-semibold ${isEligible ? 'text-gray-900' : 'text-gray-500'}`}>
              {offer.monthly_installment 
                ? formatAmountDetailed(offer.monthly_installment) 
                : (offer.loan_offered_upto && offer.minimum_interest_rate && offer.maximum_loan_tenure
                    ? 'Varies by amount'
                    : 'Based on approval'
                  )
              }
            </span>
          </div>

                     {/* Total Payable Amount */}
           <div className="flex justify-between items-center border-t border-gray-200 pt-4">
             <div className="flex items-center gap-2 pr-4">
               <span className="text-gray-600 text-sm font-medium">Total Payable Amount</span>
               <InfoButton field="totalPayableAmount" />
             </div>
            <span className={`text-xl font-bold ${isEligible ? 'text-primary' : 'text-gray-500'}`}>
              {offer.total_payable_amount 
                ? formatAmountDetailed(offer.total_payable_amount) 
                : (offer.loan_offered_upto && offer.minimum_interest_rate && offer.maximum_loan_tenure
                    ? 'Varies by tenure'
                    : 'Based on final terms'
                  )
              }
            </span>
          </div>

          {/* Rejection Reason for Ineligible Offers */}
          {!isEligible && offer.rejectedReason && (
            <div className="border-t border-red-200 pt-4">
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-700 mb-1">Why you're not eligible:</p>
                  <p className="text-sm text-red-600">
                    {translateRejectionReason(offer.rejectedReason, offer)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

                 {/* Processing Fee */}
         <div className="mt-4 flex items-center text-xs text-gray-500">
           <div className="flex items-center gap-2 pr-4">
             <span>Processing Fee: {offer.processingFees || offer.processing_fee || (isEligible ? 'As per lender' : 'Standard rates apply')}</span>
             <InfoButton field="processingFee" />
           </div>
         </div>
      </div>

      {/* Rejection Reason Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowRejectionModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="pr-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Not Eligible</h3>
                  <p className="text-sm text-gray-600">{offer.lender_name}</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800 font-medium mb-2">Why you were not approved:</p>
                <p className="text-sm text-red-700 leading-relaxed">
                  {translateRejectionReason(offer.rejectedReason, offer)}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-1">💡 What you can do:</p>
                <p className="text-sm text-blue-700">
                  {getActionSuggestion(offer.rejectedReason, offer)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRejectionModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Interest Rate Calculation Modal */}
      {showInterestRateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowInterestRateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="pr-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Interest Rate Calculation</h3>
                  <p className="text-sm text-gray-600">{offer.lender_name}</p>
                </div>
              </div>

                             {/* Calculation Table */}
               <div className="bg-gray-50 rounded-lg p-6 mb-6">
                 <div className="space-y-4">
                   {/* Header Row */}
                   <div className="grid grid-cols-4 gap-6 text-center border-b border-gray-200 pb-3">
                     <div className="font-semibold text-gray-700 text-sm"></div>
                     <div className="font-semibold text-gray-700 text-sm">Minimum</div>
                     <div className="font-semibold text-gray-700 text-sm">Maximum</div>
                     <div className="font-semibold text-gray-700 text-sm">Difference</div>
                   </div>
                   
                   {/* Interest Rate Row */}
                   <div className="grid grid-cols-4 gap-6 items-center py-2">
                     <div className="text-sm font-medium text-gray-700 text-left">Interest Rate</div>
                     <div className="text-center font-semibold text-gray-900 text-lg">{offer.minimum_interest_rate}%</div>
                     <div className="text-center font-semibold text-gray-900 text-lg">{offer.maximum_interest_rate}%</div>
                     <div className="text-center text-sm text-gray-500 font-medium">
                       {offer.minimum_interest_rate && offer.maximum_interest_rate 
                         ? `${(parseFloat(offer.maximum_interest_rate.toString()) - parseFloat(offer.minimum_interest_rate.toString())).toFixed(1)}%`
                         : '-'
                       }
                     </div>
                   </div>
                   
                   {/* Total Interest Paid Row */}
                   <div className="grid grid-cols-4 gap-6 items-center py-2">
                     <div className="text-sm font-medium text-gray-700 text-left">Total Interest Paid</div>
                     <div className="text-center font-semibold text-gray-900 text-sm leading-tight">
                       {offer.minimum_total_interest_paid ? formatAmountDetailed(offer.minimum_total_interest_paid) : 'N/A'}
                     </div>
                     <div className="text-center font-semibold text-gray-900 text-sm leading-tight">
                       {offer.maximum_total_interest_paid ? formatAmountDetailed(offer.maximum_total_interest_paid) : 'N/A'}
                     </div>
                     <div className="text-center text-sm text-gray-500 font-medium leading-tight">
                       {offer.minimum_total_interest_paid && offer.maximum_total_interest_paid 
                         ? formatAmountDetailed(
                             parseFloat(offer.maximum_total_interest_paid.toString()) - parseFloat(offer.minimum_total_interest_paid.toString())
                           )
                         : '-'
                       }
                     </div>
                   </div>
                   
                   {/* Net Payable Amount Row */}
                   <div className="grid grid-cols-4 gap-6 items-center py-2">
                     <div className="text-sm font-medium text-gray-700 text-left">Net Payable Amount</div>
                     <div className="text-center font-semibold text-gray-900 text-sm leading-tight">
                       {offer.minimum_total_payable_amount_range ? formatAmountDetailed(offer.minimum_total_payable_amount_range) : 'N/A'}
                     </div>
                     <div className="text-center font-semibold text-gray-900 text-sm leading-tight">
                       {offer.maximum_total_payable_amount_range ? formatAmountDetailed(offer.maximum_total_payable_amount_range) : 'N/A'}
                     </div>
                     <div className="text-center text-sm text-gray-500 font-medium leading-tight">
                       {offer.minimum_total_payable_amount_range && offer.maximum_total_payable_amount_range 
                         ? formatAmountDetailed(
                             parseFloat(offer.maximum_total_payable_amount_range.toString()) - parseFloat(offer.minimum_total_payable_amount_range.toString())
                           )
                         : '-'
                       }
                     </div>
                   </div>
                 </div>
               </div>

              {/* Explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-1">💡 What this means:</p>
                <p className="text-sm text-blue-700">
                  The difference shows how much more you could pay with the maximum interest rate compared to the minimum rate. 
                  Lower rates mean significant savings on your total loan cost.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end mt-6">
              <Button
                size="sm"
                onClick={() => setShowInterestRateModal(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                OKAY
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
    </div>
  );
};