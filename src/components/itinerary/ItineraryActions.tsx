import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Share2, Printer } from 'lucide-react';

interface ItineraryActionsProps {
  itineraryId: string;
  destination: string;
}

export default function ItineraryActions({ itineraryId, destination }: ItineraryActionsProps) {
  const navigate = useNavigate();

  const handleShare = async () => {
    const url = `${window.location.origin}/itinerary/${itineraryId}`;
    const shareData = {
      title: `Roamora — ${destination} Itinerary`,
      text: `Check out my travel itinerary for ${destination}, crafted by Roamora AI!`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch {
        // Fallback
        prompt('Copy this link:', url);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-3xl mx-auto px-6 md:px-12 py-12"
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {/* Plan Another Trip */}
        <button
          onClick={() => navigate('/planner')}
          className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 via-primary-400 to-primary-300 text-dark-950 font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-glow-gold-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
        >
          <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
          Plan Another Trip
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.07] hover:text-white/80 font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          Share Trip
        </button>

        {/* Print */}
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.07] hover:text-white/80 font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>
    </motion.div>
  );
}
