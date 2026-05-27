/* =====================================================
   Itinerary Model — Mongoose Schema
   ===================================================== */

import mongoose from 'mongoose';

const CoordinatesSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const ActivitySchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['sightseeing', 'food', 'trek', 'photography', 'camping', 'cultural', 'transport', 'rest'],
      required: true,
    },
    location: { type: String, required: true },
    coordinates: { type: CoordinatesSchema, default: undefined },
    estimatedCost: { type: Number, default: 0 },
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'hard'],
      default: 'easy',
    },
    isHiddenGem: { type: Boolean, default: false },
    photographyTip: { type: String, default: '' },
    goldenHourInfo: { type: String, default: '' },
    droneAllowed: { type: Boolean, default: false },
  },
  { _id: false }
);

const DaySchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, required: true },
    date: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    activities: [ActivitySchema],
    totalCost: { type: Number, default: 0 },
  },
  { _id: false }
);

const PreferencesSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true },
    budget: {
      type: String,
      enum: ['backpacker', 'balanced', 'luxury'],
      required: true,
    },
    vibes: [{ type: String }],
    tripType: {
      type: String,
      enum: ['solo', 'couple', 'friends', 'family'],
      required: true,
    },
    energy: {
      type: String,
      enum: ['relaxed', 'moderate', 'packed'],
      required: true,
    },
    duration: { type: Number, required: true, min: 1, max: 14 },
    startDate: { type: String },
  },
  { _id: false }
);

const ItinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: null,
      index: true,
    },
    destination: { type: String, required: true },
    preferences: { type: PreferencesSchema, required: true },
    days: [DaySchema],
    totalBudget: { type: Number, required: true },
    packingSuggestions: [{ type: String }],
    travelTips: [{ type: String }],
    provider: {
      type: String,
      enum: ['openai', 'groq'],
      required: true,
    },
    isPublic: { type: Boolean, default: false },
  },
  {
    timestamps: true, // auto createdAt + updatedAt
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for user itinerary listing (sorted by newest first)
ItinerarySchema.index({ userId: 1, createdAt: -1 });

const Itinerary = mongoose.model('Itinerary', ItinerarySchema);

export default Itinerary;
