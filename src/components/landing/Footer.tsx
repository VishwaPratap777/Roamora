import { MountainSnow, ArrowRight, Heart, Globe } from 'lucide-react';

import logo from '../../assets/logo.png';

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

const footerLinks = {
  Explore: ['Hidden Gems', 'Popular Destinations', 'Photography Spots', 'Road Trips', 'Offbeat Treks'],
  Company: ['About Us', 'Blog', 'Careers', 'Press Kit', 'Partners'],
  Support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

export default function Footer() {
  return (
    <footer className="relative bg-dark-950 border-t border-white/5" id="footer">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <a href="/" className="flex items-center mb-5 group">
              <img
                src={logo}
                alt="Roamora Logo"
                className="h-16 md:h-22 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </a>

            <p className="text-white/40 text-sm font-body leading-relaxed max-w-sm mb-6">
              AI-powered travel planning for modern explorers. Discover hidden gems, 
              build the perfect itinerary, and experience places like never before.
            </p>

            {/* Newsletter */}
            <div className="flex items-center gap-2 max-w-sm">
              <div className="flex-1 glass rounded-full px-4 py-2.5">
                <input
                  type="email"
                  placeholder="Your email for travel inspiration"
                  className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none font-body"
                />
              </div>
              <button className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold hover:bg-accent-gold/30 transition-colors duration-300 flex-shrink-0">
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: <InstagramIcon size={16} />, label: 'Instagram' },
                { icon: <YoutubeIcon size={16} />, label: 'YouTube' },
                { icon: <Globe size={16} />, label: 'Twitter' },
                { icon: <MountainSnow size={16} />, label: 'Adventures' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-accent font-semibold text-sm mb-5 tracking-wide">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/40 text-sm font-body hover:text-white/70 transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs font-body">
            © 2026 Roamora. All rights reserved.
          </p>
          <p className="text-white/30 text-xs font-body flex items-center gap-1.5">
            Made with <Heart size={12} className="text-accent-rose fill-accent-rose" /> for modern explorers
          </p>
        </div>
      </div>
    </footer>
  );
}
