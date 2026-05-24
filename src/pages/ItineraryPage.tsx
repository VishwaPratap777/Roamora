import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ArrowLeft } from 'lucide-react';
import { useItinerary } from '../hooks/useItineraryStore';
import ItineraryHeader from '../components/itinerary/ItineraryHeader';
import DaySelector from '../components/itinerary/DaySelector';
import DayView from '../components/itinerary/DayView';
import TripSummary from '../components/itinerary/TripSummary';
import ItineraryActions from '../components/itinerary/ItineraryActions';

export default function ItineraryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const itinerary = useItinerary(id || '');
  const [activeDay, setActiveDay] = useState(1);

  // Itinerary not found
  if (!itinerary) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-white/[0.06] flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8 text-white/30" />
          </div>
          <h1 className="text-2xl font-heading text-white/80">
            Itinerary Not Found
          </h1>
          <p className="text-sm text-white/40 max-w-md">
            This itinerary may have expired or doesn't exist. Try generating a new one!
          </p>
          <button
            onClick={() => navigate('/planner')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 text-dark-950 font-semibold text-sm hover:shadow-glow-gold transition-all duration-300 cursor-pointer"
          >
            Plan a New Trip
          </button>
        </motion.div>
      </div>
    );
  }

  const currentDay = itinerary.days.find((d) => d.dayNumber === activeDay) || itinerary.days[0];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Top Nav Bar */}
      <header className="relative z-40 flex items-center justify-between px-6 md:px-12 py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group cursor-pointer"
        >
          <Compass className="w-5 h-5 text-primary-400 group-hover:rotate-45 transition-transform duration-500" />
          <span className="text-lg font-heading text-gradient-gold">
            Roamora
          </span>
        </button>

        <button
          onClick={() => navigate('/planner')}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">New Trip</span>
        </button>
      </header>

      {/* Itinerary Header */}
      <ItineraryHeader itinerary={itinerary} />

      {/* Day Selector */}
      <DaySelector
        days={itinerary.days}
        activeDay={activeDay}
        onSelect={setActiveDay}
      />

      {/* Day View */}
      <AnimatePresence mode="wait">
        <DayView key={currentDay.dayNumber} day={currentDay} />
      </AnimatePresence>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      </div>

      {/* Trip Summary */}
      <TripSummary itinerary={itinerary} />

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      </div>

      {/* Actions */}
      <ItineraryActions
        itineraryId={itinerary.id}
        destination={itinerary.destination}
      />

      {/* Footer spacer */}
      <div className="h-8" />
    </div>
  );
}
