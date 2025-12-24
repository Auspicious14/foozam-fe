import type { AppProps } from 'next/app';
import '../styles/globals.css';
import 'leaflet/dist/leaflet.css';
import { AppProvider } from '../context';
import { AuthProvider } from '../modules/auth/context';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App({ Component, pageProps }: AppProps) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
