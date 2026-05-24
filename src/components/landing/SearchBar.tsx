import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';

const SUGGESTIONS = [
  'Spiti Valley, India',
  'Faroe Islands',
  'Hallstatt, Austria',
  'Sapa, Vietnam',
  'Lofoten, Norway',
  'Meghalaya, India',
  'Socotra, Yemen',
  'Patagonia, Chile',
];

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = query.length > 0
    ? SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : SUGGESTIONS.slice(0, 5);

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/planner?destination=${encodeURIComponent(suggestion)}`);
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/planner?destination=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/planner');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative w-full max-w-[560px] mx-auto"
    >
      {/* Search Input Container */}
      <div
        className={`
          relative flex items-center gap-3
          bg-white/[0.08] backdrop-blur-xl
          border border-white/10
          rounded-full
          px-5 py-3
          shadow-glass-lg
          transition-all duration-500 ease-out
          hover:bg-white/[0.12] hover:border-white/15
          ${isFocused ? 'ring-2 ring-accent-gold/40 border-accent-gold/30 bg-white/[0.14] shadow-glow-gold' : ''}
        `}
      >
        {/* Location Icon */}
        <MapPin 
          size={18} 
          className={`flex-shrink-0 transition-colors duration-300 ${
            isFocused ? 'text-accent-gold' : 'text-white/50'
          }`} 
        />

        {/* Input */}
        <input
          type="text"
          placeholder="Where do you want to explore?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex-1 bg-transparent text-white text-sm placeholder:text-white/40 outline-none font-body caret-accent-gold"
          id="search-destination"
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-accent-gold to-accent-amber flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-accent-gold/20 hover:shadow-glow-gold/40"
          aria-label="Search"
        >
          <Search size={16} className="text-dark-950 stroke-[2.5]" />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute top-full left-0 right-0 mt-2.5 bg-dark-950/85 backdrop-blur-2xl rounded-2xl shadow-glass-xl overflow-hidden z-50 border border-white/10"
        >
          <div className="py-2.5">
            <p className="px-5 py-2 text-[10px] text-white/40 uppercase tracking-[0.2em] font-accent font-semibold">
              {query ? 'Suggestions' : 'Popular Hidden Gems'}
            </p>
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full px-5 py-3 flex items-center gap-3 hover:bg-white/[0.06] transition-all duration-300 text-left group border-b border-white/5 last:border-b-0"
              >
                <MapPin size={14} className="text-accent-gold/70 group-hover:text-accent-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                <span className="text-sm text-white/80 group-hover:text-white font-body font-light transition-colors duration-300">{suggestion}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
