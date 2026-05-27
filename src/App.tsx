import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignIn, SignUp, SignedIn } from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage';
import PlannerPage from './pages/PlannerPage';
import ItineraryPage from './pages/ItineraryPage';
import DashboardPage from './pages/DashboardPage';

/**
 * Protected route wrapper — only renders children when signed in.
 * Falls through when Clerk is not configured (no auth mode).
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const clerkConfigured = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkConfigured) {
    return <>{children}</>;
  }

  return <SignedIn>{children}</SignedIn>;
}

function App() {
  const clerkConfigured = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/itinerary/:id" element={<ItineraryPage />} />

        {/* Auth routes (only meaningful when Clerk is configured) */}
        {clerkConfigured && (
          <>
            <Route
              path="/sign-in/*"
              element={
                <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                  <SignIn
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
                    afterSignInUrl="/dashboard"
                  />
                </div>
              }
            />
            <Route
              path="/sign-up/*"
              element={
                <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                  <SignUp
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in"
                    afterSignUpUrl="/dashboard"
                  />
                </div>
              }
            />
          </>
        )}

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
