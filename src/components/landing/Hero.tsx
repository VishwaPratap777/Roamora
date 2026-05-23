import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ChevronUp, MountainSnow, ArrowRight } from 'lucide-react';
import SearchBar from './SearchBar';
import { FEATURED_DESTINATIONS } from '../../lib/constants';
import roamoraBg from '../../assets/roamora.png';

/* Inline SVG social icons (not available in lucide-react) */
const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" />
  </svg>
);

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const featuredDest = FEATURED_DESTINATIONS[0]; // Serene Himalayas

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden"
      id="hero"
    >
      {/* ==========================================
          BACKGROUND IMAGE LAYER (Parallax)
          ========================================== */}
      <motion.div
        className="absolute inset-0 w-full h-[130%] -top-[15%]"
        style={{ y: bgY }}
      >
        {/* USER: Replace with your custom hero image */}
        <img
          src={roamoraBg}
          alt="Explorer standing on mountain cliff overlooking clouds and peaks"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </motion.div>

      {/* ==========================================
          FOG / CLOUD LAYERS (Animated)
          ========================================== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Fog layer 1 */}
        <div
          className="fog-layer absolute bottom-[20%] left-[-10%] opacity-[0.04] animate-fog-drift"
          style={{ height: '30%' }}
        />
        {/* Fog layer 2 */}
        <div
          className="fog-layer absolute bottom-[30%] left-[-5%] opacity-[0.03] animate-fog-drift-reverse"
          style={{ height: '25%' }}
        />
      </div>

      {/* ==========================================
          GRADIENT OVERLAY
          ========================================== */}
      <div className="absolute inset-0 hero-overlay pointer-events-none" />

      {/* Subtle warm golden tint at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(10, 14, 26, 0.4) 60%, rgba(10, 14, 26, 0.7) 100%)',
        }}
      />

      {/* ==========================================
          CONTENT LAYER (Parallax)
          ========================================== */}
      <motion.div
        className="relative z-10 h-full flex flex-col"
        style={{ y: contentY, opacity: overlayOpacity }}
      >
        {/* Main Content — Centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20">
          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-6 h-[1px] bg-accent-gold" />
            <span className="text-accent-gold text-xs tracking-[0.3em] uppercase font-accent font-medium">
              AI-Powered Travel Planner
            </span>
            <div className="w-6 h-[1px] bg-accent-gold" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-hero font-heading text-white text-center leading-[1.05] mb-6"
          >
            Discover Beyond
            <br />
            <span className="italic">The Obvious</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-hero-sub text-white/70 text-center mb-10 font-body font-light"
          >
            Uncover hidden gems, build the perfect itinerary,
            <br className="hidden sm:block" />
            and experience places like never before.
          </motion.p>

          {/* Search Bar */}
          <SearchBar />
        </div>

        {/* ==========================================
            BOTTOM ELEMENTS
            ========================================== */}
        <div className="relative px-6 md:px-10 pb-8 flex items-end justify-between">
          {/* Scroll Indicator — Bottom Left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="hidden md:flex flex-col items-center gap-3"
          >
            <span className="text-[10px] tracking-[0.25em] uppercase text-white/50 font-accent" style={{ writingMode: 'vertical-lr' }}>
              Scroll
            </span>
            <ChevronDown size={14} className="text-white/50 animate-scroll-hint" />
            <div className="w-[1px] h-8 bg-white/20" />
          </motion.div>

          {/* Destination Preview Card — Bottom Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden md:flex ml-auto"
          >
            <div className="glass rounded-2xl p-3 flex items-center gap-3 max-w-[320px] hover:bg-white/[0.08] transition-all duration-300 group cursor-pointer">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={featuredDest.image}
                  alt={featuredDest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-semibold font-accent truncate">
                  {featuredDest.name}
                </h3>
                <p className="text-white/50 text-xs font-body mt-0.5">
                  {featuredDest.location}
                </p>
                <p className="text-white/40 text-[10px] font-body mt-1">
                  {featuredDest.tags.join(' • ')}
                </p>
                <div className="flex items-center gap-1 mt-1.5 text-accent-gold text-xs font-medium group-hover:gap-2 transition-all duration-300">
                  <span>Explore Now</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ==========================================
          LEFT SOCIAL SIDEBAR (Fixed position relative to hero)
          ========================================== */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-8 bg-white/20" />
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white transition-colors duration-300"
          aria-label="Instagram"
        >
          <InstagramIcon size={16} />
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white transition-colors duration-300"
          aria-label="YouTube"
        >
          <YoutubeIcon size={16} />
        </a>
        <a
          href="#"
          className="text-white/40 hover:text-white transition-colors duration-300"
          aria-label="Mountain adventures"
        >
          <MountainSnow size={16} />
        </a>
        <div className="w-[1px] h-8 bg-white/20" />
      </motion.div>

      {/* ==========================================
          RIGHT PAGE NAVIGATION
          ========================================== */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-2"
      >
        <button
          className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronUp size={16} />
        </button>
        <span className="text-white/70 text-sm font-accent font-medium py-1">01</span>
        <button
          className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronDown size={16} />
        </button>
      </motion.div>
    </section>
  );
}
