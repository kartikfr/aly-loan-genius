import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Check, Clock, Star, Users, Award, Target, Zap, TrendingUp, ChevronDown, HelpCircle, Send, Mail, Phone, User } from 'lucide-react';
import { useState } from 'react';
import { OTPModal } from '@/components/auth/OTPModal';
import { useAuth } from '@/contexts/AuthContext';
import { submitContactForm } from '@/lib/contactService';

const Index = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-success/10 pt-20 pb-32">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-success/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-10">
            <div className="trust-badge animate-fade-in hover-scale">
              <Shield className="h-4 w-4" />
              <span className="text-xs md:text-sm">256-bit SSL Encrypted</span>
            </div>
            <div className="trust-badge animate-fade-in hover-scale">
              <Check className="h-4 w-4" />
              <span className="text-xs md:text-sm">Zero Paperwork</span>
            </div>
            <div className="trust-badge animate-fade-in hover-scale">
              <Clock className="h-4 w-4" />
              <span className="text-xs md:text-sm">Instant Rate Comparison</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-poppins font-bold text-foreground mb-4 leading-tight animate-fade-in">
            Find India's Lowest Loan Rates
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              in One Minute
            </span>
          </h1>
          
          {/* Tagline */}
          <div className="mb-10 animate-fade-in">
            <p className="text-xl md:text-2xl font-medium text-primary/90">
              Stop overpaying. Start saving thousands.
            </p>
          </div>

          <div className="mb-12 animate-fade-in">
            <button
              onClick={handleCTAClick}
              className="btn-trust inline-flex items-center gap-3 text-lg hover-scale group"
            >
              Get My Best Rates Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Enhanced social proof with cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto animate-fade-in">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:bg-card/80 transition-all hover-scale">
              <div className="flex items-center justify-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-semibold text-foreground">1,00,000+</div>
                  <div className="text-xs text-muted-foreground">Happy Customers</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:bg-card/80 transition-all hover-scale">
              <div className="flex items-center justify-center gap-3">
                <TrendingUp className="h-5 w-5 text-success" />
                <div className="text-left">
                  <div className="font-semibold text-foreground">50+</div>
                  <div className="text-xs text-muted-foreground">Bank Partners</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:bg-card/80 transition-all hover-scale">
              <div className="flex items-center justify-center gap-3">
                <Award className="h-5 w-5 text-success" />
                <div className="text-left">
                  <div className="font-semibold text-foreground">100%</div>
                  <div className="text-xs text-muted-foreground">RBI Registered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-poppins font-semibold text-center mb-12">
            Why Loan Genius?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Privacy First</h3>
              <p className="text-muted-foreground">
                We respect your privacy and keep your data secure with bank-grade encryption
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-success/20 transition-colors">
                <Users className="h-10 w-10 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Guided Journey</h3>
              <p className="text-muted-foreground">
                Our experts guide you through every step, so you don't need to do research
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-warning/20 transition-colors">
                <Award className="h-10 w-10 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Matching</h3>
                              <p className="text-muted-foreground">
                  Don't just compare loans - understand them with our intelligent recommendations
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-background relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-poppins font-semibold mb-4">
              How Loan Genius Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get matched with the perfect loan in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative group">
              {/* Connection line */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0"></div>
              
              <div className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-all group-hover:-translate-y-2 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Quick Assessment</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Answer a few questions about your loan needs. Get matched instantly.
                </p>
              </div>
            </div>
            
            <div className="relative group">
              {/* Connection line */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0"></div>
              
              <div className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-all group-hover:-translate-y-2 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Smart Matching</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our intelligent system analyzes 50+ RBI-registered lenders to find offers that match your profile
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-all group-hover:-translate-y-2 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-warning to-warning/80 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Get Approved</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Choose your best offer and get approved with your lowest rate
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary-hover to-primary relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-poppins font-semibold text-primary-foreground mb-6">
            Ready to find your perfect loan?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their ideal loan through Loan Genius
          </p>
          
          <div className="mb-8">
            <button
              onClick={handleCTAClick}
              className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all hover-scale group shadow-lg"
            >
              Start My Application
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-primary-foreground/80 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Zero Paperwork Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Instant Rate Comparison</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-poppins font-semibold text-foreground">
                Frequently Asked Questions
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Get quick answers to common questions about personal loans and our platform
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {faqData.map((faq) => (
              <div
                key={faq.id}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${
                      openFAQ === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openFAQ === faq.id && (
                  <div className="px-6 pb-5 pt-0">
                    <div className="border-t border-border pt-4">
                      <p className="text-muted-foreground leading-relaxed">
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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-poppins font-semibold text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Have a question or feedback? We'd love to hear from you!
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
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
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
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
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
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
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
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
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="container mx-auto px-4 py-12">
          {/* Header Quote */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              LOAN GENIUS
            </h2>
            <p className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
              "Your financial freedom starts with smart comparison. We connect you with India's lowest loan rates from 50+ trusted RBI-registered lenders."
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Privacy Statement */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-gray-300" />
                </div>
                <p className="text-sm text-gray-400">
                  We value your time and privacy. Your details are secure and used only to assist you better.
                </p>
              </div>

              {/* Copyright */}
              <div className="text-sm text-gray-400 text-center md:text-right">
                <div>© 2025 Loan Genius</div>
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
    </div>
  );
};

export default Index;
