import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass } from 'lucide-react';
import PlannerProgress from '../components/planner/PlannerProgress';
import StepDestination from '../components/planner/StepDestination';
import StepPreferences from '../components/planner/StepPreferences';
import StepVibes from '../components/planner/StepVibes';
import StepGenerate from '../components/planner/StepGenerate';
import GeneratingScreen from '../components/planner/GeneratingScreen';
import { generateItinerary } from '../services/itineraryApi';
import { saveItinerary } from '../hooks/useItineraryStore';
import type { TripPreferences } from '../types';

const DEFAULT_PREFERENCES: TripPreferences = {
  destination: '',
  budget: 'balanced',
  vibes: [],
  tripType: 'solo',
  energy: 'moderate',
  duration: 3,
};

export default function PlannerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-fill destination from query params (from landing search bar)
  const initialDest = searchParams.get('destination') || '';

  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<TripPreferences>({
    ...DEFAULT_PREFERENCES,
    destination: initialDest,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 4;

  const handleChange = useCallback((updates: Partial<TripPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  }, []);

  const goNext = useCallback(() => {
    setStep((s) => Math.min(totalSteps, s + 1));
    setError(null);
  }, []);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(1, s - 1));
    setError(null);
  }, []);

  const jumpTo = useCallback((target: number) => {
    setStep(target);
    setError(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const itinerary = await generateItinerary(preferences);
      saveItinerary(itinerary);
      navigate(`/itinerary/${itinerary.id}`);
    } catch (err) {
      setIsGenerating(false);
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    }
  }, [preferences, navigate]);

  // Show generating screen overlay when generating
  if (isGenerating) {
    return <GeneratingScreen destination={preferences.destination} />;
  }

  return (
    <div className="min-h-screen bg-dark-950 relative">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(ellipse, rgba(200,164,78,0.06) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(200,164,78,0.04) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group cursor-pointer"
        >
          <Compass className="w-5 h-5 text-primary-400 group-hover:rotate-45 transition-transform duration-500" />
          <span className="text-lg font-heading text-gradient-gold">
            Roamora
          </span>
        </button>
      </header>

      {/* Progress Bar */}
      <div className="relative z-10 px-6 md:px-12 mb-10">
        <PlannerProgress currentStep={step} totalSteps={totalSteps} />
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-10 max-w-2xl mx-auto px-6 mb-6"
          >
            <div className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-3">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-200 transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steps */}
      <div className="relative z-10 px-6 md:px-12 pb-20">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepDestination
              key="step-destination"
              preferences={preferences}
              onChange={handleChange}
              onNext={goNext}
            />
          )}
          {step === 2 && (
            <StepPreferences
              key="step-preferences"
              preferences={preferences}
              onChange={handleChange}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 3 && (
            <StepVibes
              key="step-vibes"
              preferences={preferences}
              onChange={handleChange}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 4 && (
            <StepGenerate
              key="step-generate"
              preferences={preferences}
              onGenerate={handleGenerate}
              onBack={goBack}
              onJumpTo={jumpTo}
              isGenerating={isGenerating}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
