'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

interface GoogleOAuthWrapperProps {
  children: React.ReactNode;
}

// You need to get this from Google Cloud Console
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id-here';

export default function GoogleOAuthWrapper({ children }: GoogleOAuthWrapperProps) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
