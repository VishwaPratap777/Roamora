import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import AnimatedText from '../ui/AnimatedText';

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 overflow-hidden" id="cta">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/[0.05] via-transparent to-accent-gold/[0.05]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-accent-gold/[0.04] blur-[120px] pointer-events-none" />

      <div className="max-w-[800px] mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="w-8 h-[1px] bg-accent-gold/50" />
          <span className="text-accent-gold text-xs tracking-[0.25em] uppercase font-accent">
            Start Your Journey
          </span>
          <div className="w-8 h-[1px] bg-accent-gold/50" />
        </motion.div>

        <AnimatedText
          text="Ready to Explore the Unexplored?"
          tag="h2"
          className="text-section-title font-heading text-white mb-6"
          animation="fadeUp"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/50 text-lg font-body font-light mb-10 max-w-lg mx-auto"
        >
          Let AI craft your perfect adventure. No tourist traps, no crowds — just raw, authentic experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate('/planner')}
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-accent-gold to-primary-300 text-dark-950 font-accent font-semibold text-sm hover:shadow-glow-gold-lg hover:scale-[1.03] transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            Plan Your Trip
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <button
            onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-full glass text-white font-accent font-medium text-sm hover:bg-white/10 transition-all duration-300 cursor-pointer"
          >
            Explore Destinations
          </button>
        </motion.div>
      </div>
    </section>
  );
}
