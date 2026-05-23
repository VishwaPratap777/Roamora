import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Camera, MapPin, CloudSun, Wallet, Route } from 'lucide-react';
import { FEATURES } from '../../lib/constants';
import AnimatedText from '../ui/AnimatedText';

const iconMap: Record<string, React.ReactNode> = {
  brain: <Brain size={28} />,
  camera: <Camera size={28} />,
  'map-pin': <MapPin size={28} />,
  'cloud-sun': <CloudSun size={28} />,
  wallet: <Wallet size={28} />,
  route: <Route size={28} />,
};

// Bento box sizes for asymmetry
const getBentoClasses = (index: number) => {
  switch (index) {
    case 0: return 'md:col-span-2 md:row-span-1'; // Wide
    case 1: return 'md:col-span-1 md:row-span-1'; // Square
    case 2: return 'md:col-span-1 md:row-span-1'; // Square
    case 3: return 'md:col-span-2 md:row-span-1'; // Wide
    case 4: return 'md:col-span-2 md:row-span-1'; // Wide
    case 5: return 'md:col-span-1 md:row-span-1'; // Square
    default: return 'col-span-1';
  }
};

const BentoCard = ({ feature, index }: { feature: any; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative overflow-hidden rounded-3xl glass group ${getBentoClasses(index)}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Dynamic Hover Glow */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(200,164,78,0.08), transparent 40%)`,
        }}
      />
      
      {/* Border Glow */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-300 pointer-events-none rounded-3xl"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(200,164,78,0.4), transparent 40%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px'
        }}
      />

      <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-between">
        {/* Top: Icon & Number */}
        <div className="flex justify-between items-start mb-12">
          <div className="w-14 h-14 rounded-2xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold group-hover:scale-110 group-hover:bg-accent-gold/20 transition-all duration-500">
            {iconMap[feature.icon]}
          </div>
          <span className="text-white/10 font-heading text-4xl font-bold tracking-wider group-hover:text-white/20 transition-colors duration-500">
            0{index + 1}
          </span>
        </div>

        {/* Bottom: Text */}
        <div>
          <h3 className="text-2xl font-heading text-white mb-3 group-hover:text-accent-gold transition-colors duration-500">
            {feature.title}
          </h3>
          <p className="text-white/50 text-base font-body leading-relaxed max-w-sm">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function FeaturesSection() {
  return (
    <section className="section-padding-lg bg-dark-950 relative overflow-hidden" id="features">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-accent-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-[1px] bg-accent-gold/50" />
              <span className="text-accent-gold text-xs tracking-[0.25em] uppercase font-accent">
                The Ecosystem
              </span>
            </motion.div>

            <AnimatedText
              text="Travel Intelligence, Reimagined."
              tag="h2"
              className="text-4xl md:text-5xl lg:text-7xl font-heading text-white leading-tight text-balance"
              animation="fadeUp"
            />
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-base md:text-lg max-w-md font-body font-light"
          >
            Powered by AI, designed for wanderers. Every feature is built to make your journey extraordinary, down to the last detail.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {FEATURES.map((feature, idx) => (
            <BentoCard key={feature.title} feature={feature} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
