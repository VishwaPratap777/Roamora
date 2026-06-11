import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'
import AuthTokenProvider from './components/AuthTokenProvider.tsx'
import { initLenis } from './hooks/useLenis.ts'

// Bootstrap global smooth scroll before first paint
initLenis();

// Clerk publishable key from env
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

function Root() {
  // If Clerk is not configured, render without auth provider
  if (!clerkPubKey) {
    return (
      <StrictMode>
        <App />
      </StrictMode>
    );
  }

  return (
    <StrictMode>
      <ClerkProvider
        publishableKey={clerkPubKey}
        appearance={{
          variables: {
            colorPrimary: '#c8a44e',
            colorBackground: '#0a0e1a',
            colorText: '#ffffff',
            colorTextSecondary: 'rgba(255,255,255,0.7)',
            colorInputBackground: 'rgba(255,255,255,0.06)',
            colorInputText: '#ffffff',
            borderRadius: '0.75rem',
          },
          elements: {
            card: 'bg-dark-950 border border-white/10 shadow-glass-xl',
            formButtonPrimary:
              'bg-gradient-to-r from-primary-500 to-primary-400 text-dark-950 font-semibold hover:shadow-glow-gold',
          },
        }}
      >
        <AuthTokenProvider />
        <App />
      </ClerkProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
