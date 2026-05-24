import { motion } from 'framer-motion';
import { Search, Sliders, Brain, Map } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../../lib/constants';
import AnimatedText from '../ui/AnimatedText';

const stepIcons = [
  <Search size={24} />,
  <Sliders size={24} />,
  <Brain size={24} />,
  <Map size={24} />,
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function HowItWorks() {
  return (
    <section className="section-padding-lg bg-dark-900 relative overflow-hidden" id="how-it-works">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-gold/[0.02] blur-[100px] pointer-events-none" />

      <div className="max-w-[1000px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="w-8 h-[1px] bg-accent-gold/50" />
            <span className="text-accent-gold text-xs tracking-[0.25em] uppercase font-accent">
              How It Works
            </span>
            <div className="w-8 h-[1px] bg-accent-gold/50" />
          </motion.div>

          <AnimatedText
            text="Your Journey in 4 Simple Steps"
            tag="h2"
            className="text-section-title font-heading text-white mb-5"
            animation="fadeUp"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-base max-w-md mx-auto font-body font-light"
          >
            From inspiration to exploration — we make every step seamless.
          </motion.p>
        </div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative"
        >
          {/* Connecting Line */}
          <div className="absolute left-[28px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-accent-gold/30 via-accent-gold/10 to-transparent hidden md:block" />

          <div className="space-y-12 md:space-y-16">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <motion.div
                key={step.step}
                variants={stepVariants}
                className={`flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                  <div className={`glass rounded-2xl p-6 md:p-8 hover:bg-white/[0.08] transition-all duration-300 ${
                    index % 2 === 1 ? 'md:ml-auto' : ''
                  }`}>
                    <h3 className="text-white text-xl font-accent font-semibold mb-2">
                      {step.title}
                    </h3>
                    <p className="text-white/50 text-sm font-body leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Step Circle */}
                <div className="relative flex-shrink-0 order-first md:order-none">
                  <div className="w-14 h-14 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center text-accent-gold relative z-10">
                    {stepIcons[index]}
                  </div>
                  <div className="absolute inset-0 w-14 h-14 rounded-full bg-accent-gold/5 animate-pulse-soft" />
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
