import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import FeaturesSection from '../components/landing/FeaturesSection';
import DestinationShowcase from '../components/landing/DestinationShowcase';
import HowItWorks from '../components/landing/HowItWorks';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <DestinationShowcase />
      <HowItWorks />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
