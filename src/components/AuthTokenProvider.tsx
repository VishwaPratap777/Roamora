/* =====================================================
   Auth Token Provider — Bridges Clerk's useAuth() with the API layer
   ===================================================== */

import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setTokenProvider } from '../services/api';

/**
 * Invisible component that registers Clerk's getToken()
 * with the API fetch utility so all requests include auth.
 * Must be rendered inside <ClerkProvider>.
 */
export default function AuthTokenProvider() {
  const { getToken } = useAuth();

  useEffect(() => {
    setTokenProvider(() => getToken());
  }, [getToken]);

  return null;
}
