import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Train, CreditCard, Search, Shield, Zap, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  isAuthenticated: boolean;
}

const LandingPage = ({ isAuthenticated }: LandingPageProps) => {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="gradient-hero py-20 lg:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Train className="w-4 h-4" />
              Official Indian Railways ID Card System
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6">
              Generate ID Cards for{' '}
              <span className="text-primary">Mega-Rail</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create professional ID cards for Contract Service Providers in Indian Railways. 
              Compliant with Railway Board specifications and featuring QR code verification.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/create">
                    <Button size="lg" className="gap-2 text-base px-8">
                      <CreditCard className="w-5 h-5" />
                      Create New Card
                    </Button>
                  </Link>
                  <Link to="/cards">
                    <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                      <Search className="w-5 h-5" />
                      View All Cards
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button size="lg" className="gap-2 text-base px-8">
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Streamlined Card Generation
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, manage, and verify ID cards for railway contract workers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg gradient-orange flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                Instant Generation
              </h3>
              <p className="text-muted-foreground">
                Create professional ID cards in minutes with our intuitive form and live preview system
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg gradient-orange flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                QR Verification
              </h3>
              <p className="text-muted-foreground">
                Each card includes a QR code for instant verification of employee details and validity
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg gradient-orange flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                Compliant Design
              </h3>
              <p className="text-muted-foreground">
                Cards follow official Railway Board specifications with proper dimensions and layout
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Card Preview Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                Official Format ID Cards
              </h2>
              <p className="text-muted-foreground mb-6">
                Our cards are designed according to the Railway Board's official specifications 
                for Contract Service Provider identity cards, featuring:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  87mm × 54mm standard ID card dimensions
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  Orange color scheme with "ON CONTRACT" marking
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  QR code with employee details for verification
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  Blood group, contact, and validity information
                </li>
              </ul>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                {/* Sample Card Front */}
                <div 
                  className="w-80 h-48 bg-card-orange rounded-lg shadow-2xl border-2 border-card-border transform rotate-3 hover:rotate-0 transition-transform duration-300"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-card-orange-dark rounded-l-lg flex items-center justify-center">
                    <span 
                      className="text-white font-bold text-[8px] tracking-wider"
                      style={{ 
                        writingMode: 'vertical-rl', 
                        textOrientation: 'mixed',
                        transform: 'rotate(180deg)'
                      }}
                    >
                      ON CONTRACT
                    </span>
                  </div>
                  <div className="ml-6 p-3">
                    <p className="text-center font-bold text-sm font-card text-card-text">Entry Pass</p>
                    <p className="text-center text-[8px] font-card text-card-text">Sample Company Pvt. Ltd.</p>
                    <div className="flex gap-3 mt-2">
                      <div className="w-14 h-16 bg-white rounded border border-card-border flex items-center justify-center">
                        <span className="text-[8px] text-muted-foreground">Photo</span>
                      </div>
                      <div className="flex-1 text-[7px] font-card text-card-text">
                        <p><strong>Name:</strong> Sample Employee</p>
                        <p><strong>F/Name:</strong> Father Name</p>
                        <p><strong>Designation:</strong> Technician</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center">
                <Train className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-semibold text-foreground">Mega-Rail</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              ID Card Generator for Indian Railways Contract Service Providers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
