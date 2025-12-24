import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../modules/auth/context';
import Loader from '../../modules/food-recognition/components/Loader';

export default function AuthCallback() {
  const router = useRouter();
  const { login } = useAuth();
  const { token } = router.query;

  useEffect(() => {
    if (token && typeof token === 'string') {
      login(token);
    } else if (router.isReady && !token) {
      router.push('/');
    }
  }, [token, router.isReady]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-green-100">
      <Loader />
      <p className="mt-4 text-orange-700 font-semibold animate-pulse">
        Completing your sign in...
      </p>
    </div>
  );
}
