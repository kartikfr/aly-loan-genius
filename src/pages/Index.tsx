import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Check, Clock, Star, Users, Award, Target, Zap, TrendingUp, ChevronDown, HelpCircle, Send, Mail, Phone, User, Instagram, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { OTPModal } from '@/components/auth/OTPModal';
import { useAuth } from '@/contexts/AuthContext';
import { submitContactForm } from '@/lib/contactService';
import alyImage from '@/Assets/aly pp.webp';
import alyPointingImage from '@/Assets/aly pointing image.webp';
import instagramLogo from '@/Assets/pngtree-instagram-icon-instagram-logo-png-image_3584852.png';
// Company logo imports
import olaCabsLogo from '@/Assets/ola-cabs-logo-png-transparent.png';
import oyoRoomsLogo from '@/Assets/OYO_Rooms_(logo).png';
import amazonLogo from '@/Assets/Amazon_logo.svg.png';
import microsoftLogo from '@/Assets/Microsoft_logo_(2012).svg.png';
import companyLogo from '@/Assets/65225ab6d965e5804a632b643e317bf4.jpg';
import groupPhoto from '@/Assets/group photo.webp';

// Custom hook for number animation
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, isVisible]);

  return { count, ref };
};

// Nudge notification data
const nudgeNotifications = [
  { name: "Neha", city: "Jamnagar", amount: "1L+", type: "approved", message: "just got loan approved" },
  { name: "Manish", city: "Pune", amount: "10L", type: "applied", message: "just applied for marriage loan" },
  { name: "Arjun", city: "Mumbai", amount: "5L+", type: "approved", message: "just got loan approved" },
  { name: "Priya", city: "Bangalore", amount: "3L", type: "applied", message: "just applied for personal loan" },
  { name: "Rajesh", city: "Delhi", amount: "8L+", type: "approved", message: "just got home loan approved" },
  { name: "Sunita", city: "Chennai", amount: "2L", type: "applied", message: "just applied for education loan" },
  { name: "Amit", city: "Hyderabad", amount: "6L+", type: "approved", message: "just got business loan approved" },
  { name: "Kavya", city: "Ahmedabad", amount: "4L", type: "applied", message: "just applied for car loan" },
  { name: "Vikram", city: "Kolkata", amount: "7L+", type: "approved", message: "just got loan approved" },
  { name: "Rekha", city: "Jaipur", amount: "1.5L", type: "applied", message: "just applied for personal loan" }
];

const Index = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [currentNudge, setCurrentNudge] = useState<typeof nudgeNotifications[0] | null>(null);
  const [showNudge, setShowNudge] = useState(false);
  
     // Number animation hooks
   const customersCount = useCountUp(10000, 2500);
   const bankPartnersCount = useCountUp(50, 2000);
   const rbiRegisteredCount = useCountUp(100, 1500);
   const trustedPeopleCount = useCountUp(50000, 3000);
   const loanDisbursedCount = useCountUp(100000000, 3000); // 10M+
       const instagramFollowersCount = useCountUp(700000, 2500); // 700k+
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleCTAClick = () => {
    setIsOTPModalOpen(true);
  };

  const handleOTPSuccess = (userData: any) => {
    // Login user with the received data and token
    login(userData, userData.token || '');
    // Navigate to questionnaire
    navigate('/questionnaire');
  };

  // Nudge notification logic
  useEffect(() => {
    const showNudgeNotification = () => {
      const randomNudge = nudgeNotifications[Math.floor(Math.random() * nudgeNotifications.length)];
      setCurrentNudge(randomNudge);
      setShowNudge(true);
      
      // No auto-hide - notification stays until next one or user closes
    };

    // Show first nudge after 3 seconds
    const initialTimeout = setTimeout(showNudgeNotification, 3000);
    
    // Then show nudges every 15 seconds
    const interval = setInterval(showNudgeNotification, 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const closeNudge = () => {
    setShowNudge(false);
  };

  // Contact form validation
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!contactForm.name.trim()) {
      errors.name = 'Name is required';
    } else if (contactForm.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!contactForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!contactForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(contactForm.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!contactForm.message.trim()) {
      errors.message = 'Message is required';
    } else if (contactForm.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitContactForm({
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        phone: contactForm.phone.trim(),
        message: contactForm.message.trim(),
        created_at: new Date().toISOString()
      });
      
      setSubmitSuccess(true);
      setContactForm({ name: '', email: '', phone: '', message: '' });
      setFormErrors({});
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqData = [
    {
      id: 1,
      question: "When should I consider taking a personal loan?",
      answer: "Consider a personal loan for weddings, education, medical emergencies, home renovation, debt consolidation, or travel. Personal loans offer flexibility for any legitimate financial need."
    },
    {
      id: 2,
      question: "What are the minimum and maximum loan amounts?",
      answer: "Loan amounts typically range from ₹50,000 to ₹50 lakhs, depending on your income and eligibility. Higher amounts may require additional verification from lenders."
    },
    {
      id: 3,
      question: "How does credit score affect loan approval?",
      answer: "Your credit score (300-900) shows lenders how reliably you repay debts. A score above 700 significantly improves approval chances and gets you better interest rates."
    },
    {
      id: 4,
      question: "What's the maximum loan amount I'm eligible for?",
      answer: "You can get up to ₹50 lakhs, but your actual limit depends on your income, existing debts, and the lender's criteria. Most lenders approve loans where EMI doesn't exceed 40% of your monthly income."
    },
    {
      id: 5,
      question: "What's the ideal loan tenure to choose?",
      answer: "Most lenders offer 1-5 years. Shorter tenure means higher EMI but less total interest; longer tenure reduces EMI but increases total cost."
    }
  ];

  const toggleFAQ = (faqId: number) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-success/10 pt-16 pb-20 md:pt-20 md:pb-32">
        {/* Background decorative elements - hidden on mobile for performance */}
        <div className="hidden md:block absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="hidden md:block absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        
        {/* Subtle floating elements - hidden on mobile */}
        <div className="hidden md:block absolute top-32 right-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="hidden md:block absolute bottom-32 left-20 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="hidden md:block absolute top-1/2 left-1/4 w-16 h-16 bg-primary/15 rounded-full blur-xl"></div>
        <div className="hidden md:block absolute top-1/3 right-1/3 w-20 h-20 bg-primary/15 rounded-full blur-xl"></div>
        
        {/* Small geometric accents - hidden on mobile */}
        <div className="hidden md:block absolute top-16 right-1/4 w-8 h-8 bg-primary/20 rotate-45"></div>
        <div className="hidden md:block absolute bottom-16 left-1/3 w-6 h-6 bg-primary/20 rotate-45"></div>
        
        {/* Floating dots - hidden on mobile */}
        <div className="hidden md:block absolute top-40 left-1/2 w-3 h-3 bg-primary/30 rounded-full"></div>
        <div className="hidden md:block absolute bottom-40 right-1/2 w-2 h-2 bg-primary/30 rounded-full"></div>
        <div className="hidden md:block absolute top-1/2 right-16 w-4 h-4 bg-primary/25 rounded-full"></div>
        <div className="hidden md:block absolute bottom-1/2 left-16 w-3 h-3 bg-primary/25 rounded-full"></div>
        
        <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[60vh] md:min-h-[80vh]">
            {/* Left Column - Main Content */}
            <div className="text-center lg:text-left space-y-6 md:space-y-10">
          {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-3 lg:gap-4 mb-6 md:mb-10">
            <div className="trust-badge animate-fade-in hover-scale">
                  <Shield className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">256-bit SSL Encrypted</span>
            </div>
            <div className="trust-badge animate-fade-in hover-scale">
                  <Check className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">Zero Paperwork</span>
            </div>
            <div className="trust-badge animate-fade-in hover-scale">
                  <Clock className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">Instant Rate Comparison</span>
            </div>
          </div>

          {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-poppins font-bold text-foreground leading-tight">
                <span className="block">Find India's Best</span>
                <span className="block bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                  Loan in 1 Minute
            </span>
          </h1>
          
          {/* Tagline */}
              <p className="text-lg sm:text-xl md:text-2xl font-medium text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Stop overpaying. Start saving thousands with India's lowest loan rates.
            </p>

              {/* CTA Button */}
              <div className="pt-4 md:pt-6">
            <button
              onClick={handleCTAClick}
                  className="btn-trust inline-flex items-center gap-3 text-base md:text-lg hover-scale group w-full sm:w-auto justify-center"
            >
              Get My Best Rates Now
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Enhanced social proof with cards */}
              <div className="pt-6 md:pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 lg:gap-6 max-w-4xl mx-auto lg:mx-0 animate-fade-in">
                                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-3 md:p-4 hover:bg-card/80 transition-all hover-scale relative overflow-hidden group">
                    {/* Animated background element */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
                      <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <div className="text-left">
                         <div className="font-semibold text-foreground text-sm md:text-base" ref={customersCount.ref}>
                           {customersCount.count.toLocaleString()}+
                         </div>
                  <div className="text-xs text-muted-foreground">Happy Customers</div>
                </div>
              </div>
            </div>
            
                  <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-3 md:p-4 hover:bg-card/80 transition-all hover-scale relative overflow-hidden group">
                    {/* Animated background element */}
                    <div className="absolute inset-0 bg-gradient-to-r from-success/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
                      <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-success" />
                <div className="text-left">
                         <div className="font-semibold text-foreground text-sm md:text-base" ref={bankPartnersCount.ref}>
                           {bankPartnersCount.count}+
                         </div>
                  <div className="text-xs text-muted-foreground">Bank Partners</div>
                </div>
              </div>
            </div>
            
                  <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-3 md:p-4 hover:bg-card/80 transition-all hover-scale relative overflow-hidden group">
                    {/* Animated background element */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
                      <Award className="h-4 w-4 md:h-5 md:w-5 text-success" />
                <div className="text-left">
                         <div className="font-semibold text-foreground text-sm md:text-base" ref={rbiRegisteredCount.ref}>
                           {rbiRegisteredCount.count}%
                         </div>
                  <div className="text-xs text-muted-foreground">RBI Registered</div>
                </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Aly's Profile */}
            <div className="flex justify-center lg:justify-end animate-fade-in mt-8 lg:mt-0">
              <div className="relative">
                {/* Main Profile Card */}
                <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-4 md:p-6 shadow-2xl w-72 sm:w-80 h-auto">
                  {/* Profile Image */}
                  <div className="flex justify-center mb-4 md:mb-5">
                    <div className="relative">
                      <img 
                        src={alyImage} 
                        alt="Aly Hajiani" 
                        className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                      />
                      {/* Floating stats around the image */}
                      <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-gradient-to-r from-primary to-primary-hover text-white rounded-full p-1.5 md:p-2 shadow-lg">
                        <Zap className="h-3 w-3 md:h-4 md:w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Name and Title */}
                  <div className="text-center mb-4 md:mb-5">
                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">Aly Hajiani</h3>
                    <p className="text-primary font-medium text-xs md:text-sm">Head - Credit Division</p>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 md:space-y-3">
                    {/* Loan Disbursed */}
                    <div className="flex items-center gap-2 md:gap-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-2 md:p-3">
                      <div className="w-7 h-7 md:w-9 md:h-9 bg-primary/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-xs md:text-sm" ref={loanDisbursedCount.ref}>
                          ₹{(loanDisbursedCount.count / 10000000).toFixed(0)}Cr+
                        </div>
                        <div className="text-xs text-muted-foreground">Loan Disbursed</div>
                      </div>
                    </div>

                    {/* Instagram Followers */}
                    <a 
                      href="https://www.instagram.com/thatcreditcardguy/?hl=en" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 md:gap-3 bg-gradient-to-r from-pink-500/10 to-purple-500/5 rounded-xl p-2 md:p-3 hover:from-pink-500/20 hover:to-purple-500/10 transition-all cursor-pointer group"
                    >
                      <div className="w-7 h-7 md:w-9 md:h-9 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center group-hover:from-pink-500/30 group-hover:to-purple-500/30 transition-all">
                        <img 
                          src={instagramLogo} 
                          alt="Instagram" 
                          className="h-3 w-3 md:h-4 md:w-4 object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-xs md:text-sm group-hover:text-pink-500 transition-colors" ref={instagramFollowersCount.ref}>
                          {(instagramFollowersCount.count / 1000).toFixed(0)}k+
                        </div>
                        <div className="text-xs text-muted-foreground group-hover:text-pink-400 transition-colors">Instagram Followers</div>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Floating decorative elements - hidden on mobile */}
                <div className="hidden md:block absolute -top-3 -left-3 w-6 h-6 bg-primary/20 rounded-full"></div>
                <div className="hidden md:block absolute -bottom-3 -right-3 w-5 h-5 bg-primary/20 rounded-full"></div>
                
                {/* Additional floating elements around the profile card - hidden on mobile */}
                <div className="hidden md:block absolute -top-6 -right-6 w-4 h-4 bg-primary/15 rounded-full"></div>
                <div className="hidden md:block absolute -bottom-6 -left-6 w-3 h-3 bg-primary/15 rounded-full"></div>
                <div className="hidden md:block absolute top-1/2 -left-8 w-5 h-5 bg-primary/10 rounded-full"></div>
                <div className="hidden md:block absolute top-1/2 -right-8 w-4 h-4 bg-primary/10 rounded-full"></div>
                
                {/* Small geometric accents - hidden on mobile */}
                <div className="hidden md:block absolute -top-8 left-1/2 w-2 h-2 bg-primary/25 rotate-45"></div>
                <div className="hidden md:block absolute -bottom-8 right-1/2 w-2 h-2 bg-primary/25 rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
      </section>




        {/* Trust Section with Image */}
       <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
           <div className="text-center mb-12 md:mb-16">
             <div className="mb-6 md:mb-8">
               <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-poppins font-bold text-foreground leading-tight mb-4">
                 Trusted by over{" "}
                 <span className="text-primary">50,000+</span>{" "}
                 people from top companies
          </h2>
               <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                 Join thousands of satisfied customers who trust us with their financial needs
               </p>
             </div>
           </div>

           {/* Group Photo */}
           <div className="max-w-5xl mx-auto mb-12 md:mb-16">
             <div className="relative">
               <img 
                 src={groupPhoto} 
                 alt="Group of people from top companies" 
                 className="w-full h-auto rounded-t-2xl shadow-2xl"
                 style={{
                   boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                 }}
               />
               {/* Bottom shadow overlay */}
               <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 bg-gradient-to-t from-black/20 to-transparent rounded-b-2xl"></div>
              </div>
           </div>

           {/* Company Logos Scroll Bar */}
           <div className="mb-12 md:mb-16">
             <div className="text-center mb-6 md:mb-8">
               <p className="text-base md:text-lg text-muted-foreground font-medium">
                 Trusted by leading companies across industries
              </p>
            </div>
            
             <div className="relative overflow-hidden">
               {/* Gradient overlays for smooth fade effect */}
               <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-background to-transparent z-10"></div>
               <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-background to-transparent z-10"></div>
               
               {/* Infinite scroll container */}
               <div className="flex animate-scroll">
                 {/* First set of logos */}
                 <div className="flex items-center gap-6 md:gap-12 px-3 md:px-6 flex-shrink-0">
                   <div className="flex items-center justify-center w-24 h-16 md:w-32 md:h-20 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border/20">
                     <img src={olaCabsLogo} alt="Ola Cabs" className="max-w-16 max-h-10 md:max-w-20 md:max-h-12 object-contain" />
              </div>
                   <div className="flex items-center justify-center w-24 h-16 md:w-32 md:h-20 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border/20">
                     <img src={oyoRoomsLogo} alt="OYO Rooms" className="max-w-16 max-h-10 md:max-w-20 md:max-h-12 object-contain" />
                   </div>
                   <div className="flex items-center justify-center w-24 h-16 md:w-32 md:h-20 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border/20">
                     <img src={amazonLogo} alt="Amazon" className="max-w-16 max-h-10 md:max-w-20 md:max-h-12 object-contain" />
                   </div>
                   <div className="flex items-center justify-center w-24 h-16 md:w-32 md:h-20 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border/20">
                     <img src={microsoftLogo} alt="Microsoft" className="max-w-16 max-h-10 md:max-w-20 md:max-h-12 object-contain" />
                   </div>
                   <div className="flex items-center justify-center w-24 h-16 md:w-32 md:h-20 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border/20">
                     <img src={companyLogo} alt="Company" className="max-w-16 max-h-10 md:max-w-20 md:max-h-12 object-contain" />
                   </div>
            </div>
            
                 {/* Duplicate set for seamless loop */}
                 <div className="flex items-center gap-6 md:gap-12 px-3 md:px-6 flex-shrink-0">
                   <div className="flex items-center justify-center w-24 h-16 md:w-32 md:h-20 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border/20">
                     <img src={olaCabsLogo} alt="Ola Cabs" className="max-w-16 max-h-10 md:max-w-20 md:max-h-12 object-contain" />
              </div>
                   <div className="flex items-center justify-center w-24 h-16 md:w-32 md:h-20 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border/20">
                     <img src={oyoRoomsLogo} alt="OYO Rooms" className="max-w-16 max-h-10 md:max-w-20 md:max-h-12 object-contain" />
            </div>
                   <div className="flex items-center justify-center w-24 h-16 md:w-32 md:h-20 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border/20">
                     <img src={amazonLogo} alt="Amazon" className="max-w-16 max-h-10 md:max-w-20 md:max-h-12 object-contain" />
                   </div>
                   <div className="flex items-center justify-center w-24 h-16 md:w-32 md:h-20 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border/20">
                     <img src={microsoftLogo} alt="Microsoft" className="max-w-16 max-h-10 md:max-w-20 md:max-h-12 object-contain" />
                   </div>
                   <div className="flex items-center justify-center w-24 h-16 md:w-32 md:h-20 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border/20">
                     <img src={companyLogo} alt="Company" className="max-w-16 max-h-10 md:max-w-20 md:max-h-12 object-contain" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* How it works */}
      <section className="py-12 md:py-20 bg-background relative overflow-hidden">
        {/* Decorative background - hidden on mobile */}
        <div className="hidden md:block absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-semibold mb-4">
              How Loan Genius Works
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Get matched with the perfect loan in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            <div className="relative group">
              {/* Connection line */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0"></div>
              
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-all group-hover:-translate-y-2 relative z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Target className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Quick Assessment</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Answer a few questions about your loan needs. Get matched instantly.
                </p>
              </div>
            </div>
            
            <div className="relative group">
              {/* Connection line */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0"></div>
              
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-all group-hover:-translate-y-2 relative z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Zap className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Smart Matching</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Our intelligent system analyzes 50+ RBI-registered lenders to find offers that match your profile
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-all group-hover:-translate-y-2 relative z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-warning to-warning/80 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Get Approved</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Choose your best offer and get approved with your lowest rate
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-primary via-primary-hover to-primary relative overflow-hidden">
        {/* Background decorative elements - hidden on mobile */}
        <div className="hidden md:block absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        <div className="hidden md:block absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-semibold text-primary-foreground mb-4 md:mb-6">
            Ready to find your perfect loan?
          </h2>
              <p className="text-base md:text-lg lg:text-xl text-primary-foreground/90 mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0">
            Join thousands of satisfied customers who found their ideal loan through Loan Genius
          </p>
          
          <div className="mb-6 md:mb-8">
            <button
              onClick={handleCTAClick}
              className="inline-flex items-center gap-3 bg-white text-primary px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-gray-50 transition-all hover-scale group shadow-lg w-full sm:w-auto justify-center"
            >
              Start My Application
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 text-primary-foreground/80 text-xs md:text-sm">
            <div className="flex items-center gap-1 md:gap-2">
              <Shield className="h-3 w-3 md:h-4 md:w-4" />
              <span>Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Check className="h-3 w-3 md:h-4 md:w-4" />
              <span>Zero Paperwork Required</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Clock className="h-3 w-3 md:h-4 md:w-4" />
              <span>Instant Rate Comparison</span>
                </div>
              </div>
            </div>

            {/* Right Column - Aly Pointing Image */}
            <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="relative">
                {/* Main Image Container */}
                <div className="relative">
                  <img 
                    src={alyPointingImage} 
                    alt="Aly pointing to loan opportunities" 
                    className="w-full max-w-sm md:max-w-md h-auto rounded-2xl shadow-2xl object-cover"
                  />
                  
                  {/* Floating decorative elements - hidden on mobile */}
                  <div className="hidden md:block absolute -top-3 -left-3 w-6 h-6 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="hidden md:block absolute -bottom-3 -right-3 w-5 h-5 bg-white/20 rounded-full animate-pulse delay-1000"></div>
                  
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

       {/* Testimonials Section */}
       <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-poppins font-semibold text-foreground mb-4">
               What Our Customers Say
             </h2>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
               Real stories from real people who found their perfect loan through Loan Genius
             </p>
           </div>
           
           <div className="relative overflow-hidden">
             {/* Gradient overlays for smooth fade effect */}
             <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted/20 to-transparent z-10"></div>
             <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted/20 to-transparent z-10"></div>
             
             {/* Infinite scroll container */}
             <div className="flex animate-scroll">
               {/* First set of testimonials */}
               <div className="flex items-stretch gap-8 px-6 flex-shrink-0">
                 {/* Testimonial 1 */}
                 <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-w-[350px] max-w-[350px]">
                   <div className="flex items-center gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     ))}
                   </div>
                   <p className="text-muted-foreground leading-relaxed mb-6 italic">
                     "Aly, this product actually helped me so much! I was struggling with high interest rates from my bank, but Loan Genius found me a personal loan at 2% lower. The process was incredibly smooth and I saved over ₹50,000 in interest. Highly recommend!"
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center text-white font-semibold text-lg">
                       RK
                     </div>
                     <div>
                       <h4 className="font-semibold text-foreground">Rajesh Kumar</h4>
                       <p className="text-sm text-muted-foreground">Software Engineer, Bangalore</p>
                     </div>
                   </div>
                 </div>

                 {/* Testimonial 2 */}
                 <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-w-[350px] max-w-[350px]">
                   <div className="flex items-center gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     ))}
                   </div>
                   <p className="text-muted-foreground leading-relaxed mb-6 italic">
                     "I was skeptical at first, but Aly, this platform is a game-changer! Got my wedding loan approved in just 2 days with the lowest rate possible. The customer support team was incredibly helpful throughout the entire process."
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                       PS
                     </div>
                     <div>
                       <h4 className="font-semibold text-foreground">Priya Sharma</h4>
                       <p className="text-sm text-muted-foreground">Marketing Manager, Mumbai</p>
                     </div>
                   </div>
                 </div>

                 {/* Testimonial 3 */}
                 <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-w-[350px] max-w-[350px]">
                   <div className="flex items-center gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     ))}
                   </div>
                   <p className="text-muted-foreground leading-relaxed mb-6 italic">
                     "Aly, this product actually helped me so much during a medical emergency. I needed funds quickly and Loan Genius connected me with the perfect lender. The rate comparison feature saved me hours of research and thousands of rupees."
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gradient-to-br from-warning to-warning/80 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                       AM
                     </div>
                     <div>
                       <h4 className="font-semibold text-foreground">Amit Mehta</h4>
                       <p className="text-sm text-muted-foreground">Business Owner, Delhi</p>
                     </div>
                   </div>
                 </div>

                 {/* Testimonial 4 */}
                 <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-w-[350px] max-w-[350px]">
                   <div className="flex items-center gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     ))}
                   </div>
                   <p className="text-muted-foreground leading-relaxed mb-6 italic">
                     "As a first-time loan applicant, I was completely lost. Aly, this platform made everything so simple! The step-by-step guidance and instant rate comparison helped me make an informed decision. Got approved for my dream home renovation!"
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gradient-to-br from-primary/80 to-primary rounded-full flex items-center justify-center text-white font-semibold text-lg">
                       NS
                     </div>
                     <div>
                       <h4 className="font-semibold text-foreground">Neha Singh</h4>
                       <p className="text-sm text-muted-foreground">Teacher, Pune</p>
                     </div>
                   </div>
                 </div>

                 {/* Testimonial 5 */}
                 <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-w-[350px] max-w-[350px]">
                   <div className="flex items-center gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     ))}
                   </div>
                   <p className="text-muted-foreground leading-relaxed mb-6 italic">
                     "I've used several loan comparison sites, but Aly, this one stands out! The AI-powered matching found me a loan that perfectly fit my profile. The transparency in fees and charges gave me complete confidence in my decision."
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gradient-to-br from-success/80 to-success rounded-full flex items-center justify-center text-white font-semibold text-lg">
                       VP
                     </div>
                     <div>
                       <h4 className="font-semibold text-foreground">Vikram Patel</h4>
                       <p className="text-sm text-muted-foreground">IT Consultant, Hyderabad</p>
                     </div>
                   </div>
                 </div>

                 {/* Testimonial 6 */}
                 <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-w-[350px] max-w-[350px]">
                   <div className="flex items-center gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     ))}
                   </div>
                   <p className="text-muted-foreground leading-relaxed mb-6 italic">
                     "Aly, this product actually helped me so much when I was consolidating my debts. The platform showed me exactly how much I could save and connected me with the right lender. Now I'm debt-free and couldn't be happier!"
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gradient-to-br from-warning/80 to-warning rounded-full flex items-center justify-center text-white font-semibold text-lg">
                       SK
                     </div>
                     <div>
                       <h4 className="font-semibold text-foreground">Sunita Kapoor</h4>
                       <p className="text-sm text-muted-foreground">Accountant, Chennai</p>
                     </div>
                   </div>
                 </div>

                 {/* Testimonial 7 */}
                 <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-w-[350px] max-w-[350px]">
                   <div className="flex items-center gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     ))}
                   </div>
                   <p className="text-muted-foreground leading-relaxed mb-6 italic">
                     "Aly, this product actually helped me so much with my business expansion! I needed working capital and Loan Genius matched me with the perfect lender. The approval was lightning fast and the rates were unbeatable. My business is thriving now!"
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center text-white font-semibold text-lg">
                       AG
                     </div>
                     <div>
                       <h4 className="font-semibold text-foreground">Arjun Gupta</h4>
                       <p className="text-sm text-muted-foreground">Entrepreneur, Gurgaon</p>
                     </div>
                   </div>
                 </div>

                 {/* Testimonial 8 */}
                 <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-w-[350px] max-w-[350px]">
                   <div className="flex items-center gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     ))}
                   </div>
                   <p className="text-muted-foreground leading-relaxed mb-6 italic">
                     "Being a single mother, I was worried about loan approval. Aly, this platform gave me hope! The process was so transparent and the support team guided me through every step. I got my education loan for my daughter's college. Thank you!"
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                       RM
                     </div>
                     <div>
                       <h4 className="font-semibold text-foreground">Rekha Mehta</h4>
                       <p className="text-sm text-muted-foreground">Nurse, Ahmedabad</p>
                     </div>
                   </div>
                 </div>
               </div>
               
               {/* Duplicate set for seamless loop */}
               <div className="flex items-stretch gap-8 px-6 flex-shrink-0">
                 {/* Testimonial 1 */}
                 <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-w-[350px] max-w-[350px]">
                   <div className="flex items-center gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     ))}
                   </div>
                   <p className="text-muted-foreground leading-relaxed mb-6 italic">
                     "Aly, this product actually helped me so much! I was struggling with high interest rates from my bank, but Loan Genius found me a personal loan at 2% lower. The process was incredibly smooth and I saved over ₹50,000 in interest. Highly recommend!"
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center text-white font-semibold text-lg">
                       RK
                     </div>
                     <div>
                       <h4 className="font-semibold text-foreground">Rajesh Kumar</h4>
                       <p className="text-sm text-muted-foreground">Software Engineer, Bangalore</p>
                     </div>
                   </div>
                 </div>

                 {/* Testimonial 2 */}
                 <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-w-[350px] max-w-[350px]">
                   <div className="flex items-center gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     ))}
                   </div>
                   <p className="text-muted-foreground leading-relaxed mb-6 italic">
                     "I was skeptical at first, but Aly, this platform is a game-changer! Got my wedding loan approved in just 2 days with the lowest rate possible. The customer support team was incredibly helpful throughout the entire process."
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                       PS
                     </div>
                     <div>
                       <h4 className="font-semibold text-foreground">Priya Sharma</h4>
                       <p className="text-sm text-muted-foreground">Marketing Manager, Mumbai</p>
                     </div>
                   </div>
                 </div>

                 {/* Testimonial 3 */}
                 <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-w-[350px] max-w-[350px]">
                   <div className="flex items-center gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     ))}
                   </div>
                   <p className="text-muted-foreground leading-relaxed mb-6 italic">
                     "Aly, this product actually helped me so much during a medical emergency. I needed funds quickly and Loan Genius connected me with the perfect lender. The rate comparison feature saved me hours of research and thousands of rupees."
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gradient-to-br from-warning to-warning/80 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                       AM
                     </div>
                     <div>
                       <h4 className="font-semibold text-foreground">Amit Mehta</h4>
                       <p className="text-sm text-muted-foreground">Business Owner, Delhi</p>
                     </div>
                   </div>
                 </div>

                 {/* Testimonial 4 */}
                 <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-w-[350px] max-w-[350px]">
                   <div className="flex items-center gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     ))}
                   </div>
                   <p className="text-muted-foreground leading-relaxed mb-6 italic">
                     "As a first-time loan applicant, I was completely lost. Aly, this platform made everything so simple! The step-by-step guidance and instant rate comparison helped me make an informed decision. Got approved for my dream home renovation!"
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gradient-to-br from-primary/80 to-primary rounded-full flex items-center justify-center text-white font-semibold text-lg">
                       NS
                     </div>
                     <div>
                       <h4 className="font-semibold text-foreground">Neha Singh</h4>
                       <p className="text-sm text-muted-foreground">Teacher, Pune</p>
                     </div>
                   </div>
                 </div>

                 {/* Testimonial 5 */}
                 <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-w-[350px] max-w-[350px]">
                   <div className="flex items-center gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     ))}
                   </div>
                   <p className="text-muted-foreground leading-relaxed mb-6 italic">
                     "I've used several loan comparison sites, but Aly, this one stands out! The AI-powered matching found me a loan that perfectly fit my profile. The transparency in fees and charges gave me complete confidence in my decision."
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gradient-to-br from-success/80 to-success rounded-full flex items-center justify-center text-white font-semibold text-lg">
                       VP
                     </div>
                     <div>
                       <h4 className="font-semibold text-foreground">Vikram Patel</h4>
                       <p className="text-sm text-muted-foreground">IT Consultant, Hyderabad</p>
                     </div>
                   </div>
                 </div>

                 {/* Testimonial 6 */}
                 <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-w-[350px] max-w-[350px]">
                   <div className="flex items-center gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     ))}
                   </div>
                   <p className="text-muted-foreground leading-relaxed mb-6 italic">
                     "Aly, this product actually helped me so much when I was consolidating my debts. The platform showed me exactly how much I could save and connected me with the right lender. Now I'm debt-free and couldn't be happier!"
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gradient-to-br from-warning/80 to-warning rounded-full flex items-center justify-center text-white font-semibold text-lg">
                       SK
                     </div>
                     <div>
                       <h4 className="font-semibold text-foreground">Sunita Kapoor</h4>
                       <p className="text-sm text-muted-foreground">Accountant, Chennai</p>
                     </div>
                   </div>
                 </div>

                 {/* Testimonial 7 */}
                 <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-w-[350px] max-w-[350px]">
                   <div className="flex items-center gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     ))}
                   </div>
                   <p className="text-muted-foreground leading-relaxed mb-6 italic">
                     "Aly, this product actually helped me so much with my business expansion! I needed working capital and Loan Genius matched me with the perfect lender. The approval was lightning fast and the rates were unbeatable. My business is thriving now!"
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center text-white font-semibold text-lg">
                       AG
                     </div>
                     <div>
                       <h4 className="font-semibold text-foreground">Arjun Gupta</h4>
                       <p className="text-sm text-muted-foreground">Entrepreneur, Gurgaon</p>
                     </div>
                   </div>
                 </div>

                 {/* Testimonial 8 */}
                 <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-w-[350px] max-w-[350px]">
                   <div className="flex items-center gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                     ))}
                   </div>
                   <p className="text-muted-foreground leading-relaxed mb-6 italic">
                     "Being a single mother, I was worried about loan approval. Aly, this platform gave me hope! The process was so transparent and the support team guided me through every step. I got my education loan for my daughter's college. Thank you!"
                   </p>
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                       RM
                     </div>
                     <div>
                       <h4 className="font-semibold text-foreground">Rekha Mehta</h4>
                       <p className="text-sm text-muted-foreground">Nurse, Ahmedabad</p>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-4">
              <HelpCircle className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-semibold text-foreground">
                Frequently Asked Questions
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Get quick answers to common questions about personal loans and our platform
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
            {faqData.map((faq) => (
              <div
                key={faq.id}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-4 py-4 md:px-6 md:py-5 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <h3 className="text-base md:text-lg font-semibold text-foreground pr-3 md:pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`h-4 w-4 md:h-5 md:w-5 text-muted-foreground transition-transform flex-shrink-0 ${
                      openFAQ === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openFAQ === faq.id && (
                  <div className="px-4 pb-4 pt-0 md:px-6 md:pb-5">
                    <div className="border-t border-border pt-3 md:pt-4">
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-semibold text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question or feedback? We'd love to hear from you!
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="col-span-1 md:col-span-1">
                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm md:text-base"
                    placeholder="Your Name"
                  />
                </div>
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>
              
              <div className="col-span-1 md:col-span-1">
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    value={contactForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm md:text-base"
                    placeholder="your.email@example.com"
                  />
                </div>
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
              
              <div className="col-span-1 md:col-span-1">
                <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    id="phone"
                    value={contactForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm md:text-base"
                    placeholder="9876543210"
                  />
                </div>
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  value={contactForm.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none text-sm md:text-base"
                  placeholder="Tell us about your question or feedback..."
                />
                {formErrors.message && <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>}
              </div>
              
              <div className="col-span-1 md:col-span-2">
                {formErrors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formErrors.submit}
                  </div>
                )}
                
                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 md:px-8 md:py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
          {/* Header Quote */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
              LOAN GENIUS
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed">
              "Your financial freedom starts with smart comparison. We connect you with India's lowest loan rates from 50+ trusted RBI-registered lenders."
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700">
          <div className="container mx-auto px-6 md:px-8 lg:px-12 py-4 md:py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Privacy Statement */}
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="h-3 w-3 md:h-4 md:w-4 text-gray-300" />
                </div>
                <p className="text-xs md:text-sm text-gray-400">
                  We value your time and privacy. Your details are secure and used only to assist you better.
                </p>
              </div>

              {/* Copyright */}
              <div className="text-xs md:text-sm text-gray-400 text-center md:text-right">
                <div>© 2025 Aly</div>
                <div className="mt-1">Powered by Pouring Pounds</div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* OTP Modal */}
      <OTPModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        onSuccess={handleOTPSuccess}
      />

      {/* Nudge Notification */}
      {showNudge && currentNudge && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 animate-slide-in-right">
          <div className="bg-white border border-border rounded-xl shadow-2xl p-3 md:p-4 max-w-xs md:max-w-sm relative animate-fade-in">
            {/* Close button */}
            <button
              onClick={closeNudge}
              className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="h-2.5 w-2.5 md:h-3 md:w-3 text-gray-600" />
            </button>
            
            {/* Notification content */}
            <div className="flex items-start gap-2 md:gap-3">
              {/* User avatar */}
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center text-white font-semibold text-xs md:text-sm flex-shrink-0 animate-scale-in">
                {currentNudge.name.charAt(0)}
              </div>
              
              {/* Message */}
              <div className="flex-1 min-w-0 animate-slide-up">
                <div className="text-xs md:text-sm font-medium text-foreground">
                  <span className="font-semibold">{currentNudge.name}</span> from <span className="text-primary">{currentNudge.city}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 md:mt-1">
                  <span className="font-semibold text-success">{currentNudge.amount}</span> loan {currentNudge.message}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 md:mt-1">
                  {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            
            {/* Status indicator */}
            <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 animate-bounce-in">
              <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${currentNudge.type === 'approved' ? 'bg-success animate-pulse' : 'bg-primary animate-pulse'}`}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
