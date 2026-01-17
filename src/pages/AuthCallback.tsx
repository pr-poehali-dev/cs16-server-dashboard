import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import BACKEND_URLS from '../../backend/func2url.json';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const claimedId = params.get('openid.claimed_id');

      if (!claimedId) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URLS['auth']}/?action=verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(params))
        });

        const data = await response.json();

        if (data.user) {
          localStorage.setItem('cs16_user', JSON.stringify(data.user));
          navigate('/');
          window.location.reload();
        } else {
          console.error('Auth failed:', data.error);
          navigate('/');
        }
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Icon name="Loader2" className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Авторизация через Steam...</p>
      </div>
    </div>
  );
}
