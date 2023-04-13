import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const loggedIn = sessionStorage.getItem('loggedIn') != null;
        setIsLoggedIn(loggedIn);
        if (!loggedIn) {
          router.replace('/signup');
        }
      } else {
        console.warn('sessionStorage is not available.');
      }
    }, []);

    return isLoggedIn ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default withAuth;
