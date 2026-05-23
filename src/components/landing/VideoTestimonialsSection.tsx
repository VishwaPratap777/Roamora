import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../lib/constants';

const VIDEO_SRC = '/roamora.mp4';

const INTERVAL_MS = 5000;

export default function VideoTestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  // Intersection Observer — only run RAF when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Progress bar + auto-advance
  useEffect(() => {
    if (!isVisible) {
      startTimeRef.current = null;
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const pct = Math.min(elapsed / INTERVAL_MS, 1);
      progressRef.current = pct;
      setProgress(pct);

      if (pct >= 1) {
        startTimeRef.current = null;
        setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    startTimeRef.current = null;
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [current, isVisible]);

  const goTo = (idx: number) => {
    startTimeRef.current = null;
    setProgress(0);
    setCurrent(idx);
  };

  const testimonial = TESTIMONIALS[current];

  return (
    <section
      ref={sectionRef}
      id="video-testimonials"
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: '600px' }}
    >
      {/* ── VIDEO BACKGROUND ── */}
      <video
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.72) saturate(1.1)' }}
      />

      {/* ── OVERLAYS ── */}
      {/* Top cinematic bar */}
      <div className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,14,26,0.85) 0%, transparent 100%)'
        }}
      />
      {/* Bottom heavy vignette for testimonials readability */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '60%',
          background: 'linear-gradient(to top, rgba(10,14,26,0.96) 0%, rgba(10,14,26,0.6) 50%, transparent 100%)'
        }}
      />
      {/* Subtle side vignettes */}
      <div className="absolute inset-y-0 left-0 w-32 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(10,14,26,0.4), transparent)' }}
      />
      <div className="absolute inset-y-0 right-0 w-32 pointer-events-none"
        style={{ background: 'linear-gradient(to left, rgba(10,14,26,0.4), transparent)' }}
      />

      {/* ── LABEL (top-center) ── */}
      <div className="absolute top-10 inset-x-0 flex justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-[1px] bg-accent-gold/60" />
          <span className="text-accent-gold text-xs tracking-[0.28em] uppercase font-accent">
            Voices of Explorers
          </span>
          <div className="w-8 h-[1px] bg-accent-gold/60" />
        </motion.div>
      </div>

      {/* ── TESTIMONIALS (bottom-center) ── */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-10 px-6">
        {/* Card */}
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              {/* Quote icon */}
              <div className="flex justify-center mb-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(200,164,78,0.15)', border: '1px solid rgba(200,164,78,0.3)' }}>
                  <Quote size={16} className="text-accent-gold" />
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < testimonial.rating ? 'text-accent-amber fill-accent-amber' : 'text-white/20'}
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-white/90 text-lg md:text-xl font-body font-light leading-relaxed italic mb-5"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex flex-col items-center gap-1">
                {/* Avatar circle */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-accent font-semibold text-base mb-1"
                  style={{
                    background: 'linear-gradient(135deg, rgba(200,164,78,0.5), rgba(245,158,11,0.4))',
                    border: '1.5px solid rgba(200,164,78,0.5)',
                    boxShadow: '0 0 20px rgba(200,164,78,0.2)'
                  }}>
                  {testimonial.name.charAt(0)}
                </div>
                <h4 className="text-white font-accent font-semibold text-sm tracking-wide">
                  {testimonial.name}
                </h4>
                <p className="text-white/45 text-xs font-body">
                  {testimonial.tripType} · {testimonial.destination}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── PROGRESS DOTS ── */}
        <div className="flex items-center gap-2.5 mt-7">
          {TESTIMONIALS.map((_, i) => {
            const isActive = i === current;
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="relative flex items-center justify-center"
                style={{ width: isActive ? 40 : 8, height: 8, transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)' }}
              >
                {/* Track */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: isActive ? 'rgba(200,164,78,0.25)' : 'rgba(255,255,255,0.2)',
                    transition: 'background 0.3s'
                  }}
                />
                {/* Fill */}
                {isActive && (
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${progress * 100}%`,
                      background: 'linear-gradient(to right, #c8a44e, #f5d98a)',
                      transition: 'width 0ms linear'
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
