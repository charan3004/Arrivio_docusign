import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSession } from '../../supabase/services/auth.service';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const session = await getSession();

      if (session?.user) {
        // --- POPUP HANDLER ---
        if (window.opener) {
          // The main window will detect the session change via onAuthStateChange
          window.close();
          return;
        }

        // 1. RECOVER STATE (Booking Data)
        const savedState = sessionStorage.getItem('booking_redirect_state');
        // 2. RECOVER PATH (Return URL)
        const returnPath = sessionStorage.getItem('auth_return_path');

        console.log('AuthCallback: savedState', savedState);
        console.log('AuthCallback: returnPath', returnPath);

        // Clear items only after reading
        sessionStorage.removeItem('booking_redirect_state');
        sessionStorage.removeItem('auth_return_path');

        if (savedState) {
          const parsedState = JSON.parse(savedState);
          navigate('/booking/review', { state: parsedState, replace: true });
        } else if (returnPath && returnPath !== '/login' && returnPath !== '/signin') {
          // Prevent redirecting back to login page
          navigate(returnPath, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, location]);

  return null; // or a loader if you want
};

export default AuthCallback;
