import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Check, Clock, Star, Users, Award } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-success/5 pt-20 pb-32">
        <div className="container mx-auto px-4 text-center">
          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="trust-badge">
              <Shield className="h-4 w-4" />
              <span>256-bit SSL Encrypted</span>
            </div>
            <div className="trust-badge">
              <Check className="h-4 w-4" />
              <span>No Credit Score Impact</span>
            </div>
            <div className="trust-badge">
              <Clock className="h-4 w-4" />
              <span>2-3 Minutes Only</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-poppins font-bold text-foreground mb-6 leading-tight">
            Find Your Perfect Loan in{' '}
            <span className="text-primary">under 57 secs</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Compare offers from 20+ trusted lenders. No hidden fees. No credit score impact.
          </p>

          <Link
            to="/questionnaire"
            className="btn-trust inline-flex items-center gap-3 text-lg"
          >
            Get My Best Rates Now
            <ArrowRight className="h-5 w-5" />
          </Link>

          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Trusted by 1,00,000+ Indians</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-warning fill-current" />
              <span>4.8/5 rating on Google</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-success" />
              <span>RBI Registered Partners</span>
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
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-poppins font-semibold text-center mb-12">
            How Loan Genius Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Answer Quick Questions</h3>
              <p className="text-muted-foreground">
                Tell us about your loan needs, income, and employment in just 3 minutes
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Matched Instantly</h3>
              <p className="text-muted-foreground">
                Our AI compares 20+ lenders to find your best loan offers
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose & Apply</h3>
              <p className="text-muted-foreground">
                Select your preferred offer and get instant pre-approval
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-hover">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-poppins font-semibold text-primary-foreground mb-4">
            Ready to find your perfect loan?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of satisfied customers who found their ideal loan through Loan Genius
          </p>
          
          <Link
            to="/questionnaire"
            className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
          >
            Start My Application
            <ArrowRight className="h-5 w-5" />
          </Link>
          
          <p className="text-primary-foreground/80 text-sm mt-4">
            Secure • No impact on credit score • Takes 2 minutes
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
