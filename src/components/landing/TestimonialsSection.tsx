import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../lib/constants';
import AnimatedText from '../ui/AnimatedText';

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  const testimonial = TESTIMONIALS[current];

  return (
    <section className="section-padding-lg bg-dark-950 relative overflow-hidden" id="testimonials">
      {/* Background */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-accent-gold/[0.02] blur-[100px] pointer-events-none" />

      <div className="max-w-[900px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="w-8 h-[1px] bg-accent-gold/50" />
            <span className="text-accent-gold text-xs tracking-[0.25em] uppercase font-accent">
              Testimonials
            </span>
            <div className="w-8 h-[1px] bg-accent-gold/50" />
          </motion.div>

          <AnimatedText
            text="Stories from Real Explorers"
            tag="h2"
            className="text-section-title font-heading text-white"
            animation="fadeUp"
          />
        </div>

        {/* Testimonial Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass rounded-3xl p-8 md:p-12 text-center relative"
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center">
                  <Quote size={20} className="text-accent-gold" />
                </div>
              </div>

              {/* Quote */}
              <p className="text-white/80 text-lg md:text-xl font-body font-light leading-relaxed mb-8 max-w-2xl mx-auto italic">
                "{testimonial.quote}"
              </p>

              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < testimonial.rating
                        ? 'text-accent-amber fill-accent-amber'
                        : 'text-white/20'
                    }
                  />
                ))}
              </div>

              {/* Author */}
              <div>
                {/* Avatar placeholder */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-gold/40 to-accent-amber/40 mx-auto mb-3 flex items-center justify-center text-white font-accent font-semibold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <h4 className="text-white font-accent font-semibold text-base">
                  {testimonial.name}
                </h4>
                <p className="text-white/40 text-sm font-body mt-1">
                  {testimonial.tripType} · {testimonial.destination}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'bg-accent-gold w-6'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
