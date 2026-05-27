/* =====================================================
   Dashboard Page — User's Saved Itineraries
   ===================================================== */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  MapPin,
  Calendar,
  Wallet,
  Trash2,
  ArrowRight,
  Plus,
  Loader2,
} from 'lucide-react';
import { fetchUserItineraries, deleteItinerary } from '../services/itineraryApi';
import { removeItineraryFromCache } from '../hooks/useItineraryStore';
import type { Itinerary } from '../types';

interface DashboardItinerary extends Omit<Itinerary, 'days'> {
  days?: Itinerary['days']; // days may be excluded in listing
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [itineraries, setItineraries] = useState<DashboardItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchUserItineraries();
        setItineraries(data);
      } catch (err) {
        console.error('Failed to load itineraries:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this itinerary?')) return;
    setDeletingId(id);
    try {
      await deleteItinerary(id);
      removeItineraryFromCache(id);
      setItineraries((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      console.error('Failed to delete itinerary:', err);
    } finally {
      setDeletingId(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/3 w-[600px] h-[400px] rounded-full opacity-25"
          style={{
            background:
              'radial-gradient(ellipse, rgba(200,164,78,0.06) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-15"
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

      {/* Dashboard Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pb-20">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-heading text-gradient-gold mb-2">
            Your Adventures
          </h1>
          <p className="text-white/50 text-sm">
            {user?.firstName
              ? `Welcome back, ${user.firstName}. Here are your saved itineraries.`
              : 'Here are your saved itineraries.'}
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin mb-4" />
            <p className="text-white/40 text-sm">Loading your trips...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && itineraries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-white/[0.06] flex items-center justify-center mb-6">
              <Compass className="w-8 h-8 text-white/20" />
            </div>
            <h2 className="text-xl font-heading text-white/70 mb-2">
              No Trips Yet
            </h2>
            <p className="text-sm text-white/40 max-w-md mb-8">
              Start planning your first adventure. Our AI will craft a
              personalized itinerary just for you.
            </p>
            <button
              onClick={() => navigate('/planner')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 text-dark-950 font-semibold text-sm hover:shadow-glow-gold transition-all duration-300 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Plan Your First Trip
            </button>
          </motion.div>
        )}

        {/* Itinerary Cards Grid */}
        {!loading && itineraries.length > 0 && (
          <>
            {/* New Trip Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => navigate('/planner')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 text-dark-950 font-semibold text-sm hover:shadow-glow-gold transition-all duration-300 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Trip
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {itineraries.map((trip, i) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group relative rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.08] hover:border-primary-400/30 hover:bg-white/[0.06] transition-all duration-300"
                  >
                    {/* Card Header */}
                    <div className="p-5 pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-heading text-white/90 truncate">
                            {trip.destination}
                          </h3>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-white/40">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {trip.preferences?.duration || '—'} days
                            </span>
                            <span className="flex items-center gap-1">
                              <Wallet className="w-3 h-3" />
                              ₹{(trip.totalBudget || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        <MapPin className="w-4 h-4 text-primary-400/60 flex-shrink-0 mt-1" />
                      </div>

                      {/* Tags */}
                      {trip.preferences?.vibes && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {trip.preferences.vibes.slice(0, 3).map((vibe) => (
                            <span
                              key={vibe}
                              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-400/10 text-primary-300/80 border border-primary-400/10"
                            >
                              {vibe}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Created Date */}
                      <p className="text-[11px] text-white/25">
                        {trip.createdAt
                          ? new Date(trip.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : ''}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="flex border-t border-white/[0.06]">
                      <button
                        onClick={() => navigate(`/itinerary/${trip.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-white/60 hover:text-primary-400 hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
                      >
                        <span>View Trip</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-px bg-white/[0.06]" />
                      <button
                        onClick={() => handleDelete(trip.id)}
                        disabled={deletingId === trip.id}
                        className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200 cursor-pointer disabled:opacity-50"
                      >
                        {deletingId === trip.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
