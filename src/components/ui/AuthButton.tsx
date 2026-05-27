/* =====================================================
   Auth Button — Clerk Sign-in / User Button
   ===================================================== */

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';
import { LogIn } from 'lucide-react';

interface AuthButtonProps {
  className?: string;
}

export default function AuthButton({ className = '' }: AuthButtonProps) {
  return (
    <div className={className}>
      <SignedOut>
        <SignInButton mode="modal">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                       bg-white/[0.06] border border-white/[0.1] text-white/80
                       hover:bg-white/[0.1] hover:border-white/[0.2] hover:text-white
                       transition-all duration-300 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-9 h-9 rounded-xl ring-2 ring-primary-400/30',
              userButtonPopoverCard:
                'bg-dark-900 border border-white/10 shadow-glass-xl',
              userButtonPopoverActionButton: 'text-white/70 hover:text-white',
              userButtonPopoverFooter: 'hidden',
            },
          }}
          afterSignOutUrl="/"
        />
      </SignedIn>
    </div>
  );
}
