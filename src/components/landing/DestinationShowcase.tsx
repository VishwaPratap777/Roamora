import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { FEATURED_DESTINATIONS } from '../../lib/constants';
import AnimatedText from '../ui/AnimatedText';

export default function DestinationShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-15%']);

  return (
    <section
      ref={sectionRef}
      className="py-32 bg-dark-950 relative overflow-hidden"
      id="destinations"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-accent-gold/[0.02] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent-emerald/[0.02] blur-[80px] pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 mb-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-8 h-[1px] bg-accent-gold/50" />
              <span className="text-accent-gold text-xs tracking-[0.25em] uppercase font-accent">
                Hidden Gems
              </span>
            </motion.div>

            <AnimatedText
              text="Places You Won't Find in Guidebooks"
              tag="h2"
              className="text-section-title font-heading text-white"
              animation="fadeUp"
            />
          </div>

          <motion.a
            href="/explore"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 text-accent-gold text-sm font-accent font-medium hover:gap-3 transition-all duration-300 flex-shrink-0"
          >
            View All Destinations
            <ArrowRight size={16} />
          </motion.a>
        </div>
      </div>

      {/* Horizontal Scroll Cards */}
      <motion.div
        ref={scrollContainerRef}
        style={{ x }}
        className="flex gap-6 px-6 md:px-10"
      >
        {FEATURED_DESTINATIONS.map((dest, index) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex-shrink-0 w-[320px] md:w-[380px] group cursor-pointer"
          >
            {/* Card */}
            <div className="relative rounded-2xl overflow-hidden glass">
              {/* Image */}
              <div className="relative h-[280px] md:h-[340px] overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-dark-950/20 to-transparent" />

                {/* Hidden Gem Badge */}
                {dest.isHiddenGem && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent-gold/20 backdrop-blur-md border border-accent-gold/30 text-accent-gold text-[10px] tracking-wider uppercase font-accent font-medium">
                    Hidden Gem
                  </div>
                )}

                {/* Rating */}
                {dest.rating && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full glass text-white text-xs font-accent">
                    <Star size={12} className="text-accent-amber fill-accent-amber" />
                    {dest.rating}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-white text-lg font-accent font-semibold mb-1">
                  {dest.name}
                </h3>
                <p className="text-white/40 text-xs font-body mb-2">
                  {dest.location}
                </p>
                <p className="text-white/60 text-sm font-body leading-relaxed mb-4">
                  {dest.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {dest.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-white/5 text-white/50 text-[10px] tracking-wide uppercase font-accent border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1.5 text-accent-gold text-sm font-accent font-medium group-hover:gap-3 transition-all duration-300">
                  <span>Explore</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
