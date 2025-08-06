import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Check, Clock, Star, Users, Award, Target, Zap, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { OTPModal } from '@/components/auth/OTPModal';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);

  const handleCTAClick = () => {
    setIsOTPModalOpen(true);
  };

  const handleOTPSuccess = (userData: any) => {
    // Login user with the received data and token
    login(userData, userData.token || '');
    // Navigate to questionnaire
    navigate('/questionnaire');
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
              <span className="text-xs md:text-sm">No Credit Score Impact</span>
            </div>
            <div className="trust-badge animate-fade-in hover-scale">
              <Clock className="h-4 w-4" />
              <span className="text-xs md:text-sm">Under 57 Seconds</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-poppins font-bold text-foreground mb-6 leading-tight animate-fade-in">
            Find Your Perfect Loan in{' '}
            <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              under 57 secs
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Compare personalized offers from 20+ trusted lenders. Zero hidden fees, zero credit impact, maximum transparency.
          </p>

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
                <Star className="h-5 w-5 text-warning fill-current" />
                <div className="text-left">
                  <div className="font-semibold text-foreground">4.8/5</div>
                  <div className="text-xs text-muted-foreground">Google Rating</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:bg-card/80 transition-all hover-scale">
              <div className="flex items-center justify-center gap-3">
                <Award className="h-5 w-5 text-success" />
                <div className="text-left">
                  <div className="font-semibold text-foreground">RBI</div>
                  <div className="text-xs text-muted-foreground">Registered Partners</div>
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
                Don't just compare loans - understand them with our AI-powered recommendations
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
                  Answer a few simple questions about your loan needs and financial situation in under 57 seconds
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
                  Our AI instantly analyzes 20+ lenders to find personalized offers that match your profile
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-all group-hover:-translate-y-2 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-warning to-warning/80 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Instant Approval</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Choose your preferred offer and get instant pre-approval with competitive rates
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
              <span>No Credit Score Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Takes Under 57 Seconds</span>
            </div>
          </div>
        </div>
      </section>

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
