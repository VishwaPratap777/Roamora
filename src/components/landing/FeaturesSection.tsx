import { motion } from 'framer-motion';
import { Brain, Camera, MapPin, CloudSun, Wallet, Route } from 'lucide-react';
import { FEATURES } from '../../lib/constants';
import GlassCard from '../ui/GlassCard';
import AnimatedText from '../ui/AnimatedText';

const iconMap: Record<string, React.ReactNode> = {
  brain: <Brain size={28} />,
  camera: <Camera size={28} />,
  'map-pin': <MapPin size={28} />,
  'cloud-sun': <CloudSun size={28} />,
  wallet: <Wallet size={28} />,
  route: <Route size={28} />,
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function FeaturesSection() {
  return (
    <section className="section-padding-lg bg-dark-950 relative overflow-hidden" id="features">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent-gold/[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="w-8 h-[1px] bg-accent-gold/50" />
            <span className="text-accent-gold text-xs tracking-[0.25em] uppercase font-accent">
              Features
            </span>
            <div className="w-8 h-[1px] bg-accent-gold/50" />
          </motion.div>

          <AnimatedText
            text="Travel Intelligence, Reimagined"
            tag="h2"
            className="text-section-title font-heading text-white mb-5"
            animation="fadeUp"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-base max-w-lg mx-auto font-body font-light"
          >
            Powered by AI, designed for wanderers. Every feature is built to make your journey extraordinary.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <GlassCard
                hover
                padding="lg"
                className="h-full group"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-accent-gold/10 flex items-center justify-center text-accent-gold mb-5 group-hover:bg-accent-gold/20 group-hover:scale-110 transition-all duration-300">
                  {iconMap[feature.icon]}
                </div>

                {/* Title */}
                <h3 className="text-white text-lg font-accent font-semibold mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-white/50 text-sm font-body leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
