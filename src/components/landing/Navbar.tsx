import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Menu, X, LayoutDashboard } from 'lucide-react';
import { cn } from '../../lib/utils';
import logo from '../../assets/logo.png';
import { NAV_LINKS } from '../../lib/constants';
import AuthButton from '../ui/AuthButton';

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const clerkConfigured = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'py-2 glass-dark shadow-glass'
            : 'py-3 bg-transparent'
        )}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="relative flex items-center group w-32 h-10 md:w-44 md:h-12 z-10">
            <img
              src={logo}
              alt="Roamora Logo"
              className="absolute left-0 top-1/2 -translate-y-1/2 h-16 md:h-22 w-auto max-w-none object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  'text-sm font-body transition-all duration-300 relative',
                  link.isActive
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                )}
              >
                {link.label}
                {link.isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[1px] bg-white"
                  />
                )}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Dashboard Link */}
            {clerkConfigured && (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors cursor-pointer"
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              <Moon size={18} />
            </button>

            {/* Auth Button */}
            {clerkConfigured ? (
              <AuthButton />
            ) : (
              <button
                onClick={() => navigate('/sign-in')}
                className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-sm font-medium hover:bg-white/20 hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 pt-20 glass-dark md:hidden"
          >
            <div className="flex flex-col items-center gap-6 py-10">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'text-lg font-body transition-colors',
                    link.isActive ? 'text-white' : 'text-white/60'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {clerkConfigured && (
                <a
                  href="/dashboard"
                  className="text-lg font-body text-white/60 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </a>
              )}
              <div className="mt-4 flex items-center gap-4">
                <button className="p-2 rounded-full text-white/60 hover:text-white">
                  <Moon size={18} />
                </button>
                {clerkConfigured ? (
                  <AuthButton />
                ) : (
                  <button
                    onClick={() => { navigate('/sign-in'); setIsMobileMenuOpen(false); }}
                    className="px-5 py-2 rounded-full bg-white/10 border border-white/10 text-white text-sm font-medium cursor-pointer"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
