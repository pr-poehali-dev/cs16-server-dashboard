import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import CaseRoulette from '@/components/CaseRoulette';
import PrivilegesShop from '@/components/PrivilegesShop';
import BACKEND_URLS from '../../backend/func2url.json';

export default function PublicHome() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [serverStats, setServerStats] = useState({
    players_online: 0,
    max_players: 32,
    current_map: 'de_dust2',
    ct_score: 0,
    t_score: 0,
    server_ip: ''
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchServerStats = async () => {
      try {
        const response = await fetch(`${BACKEND_URLS['server-stats']}/?action=stats`);
        const data = await response.json();
        setServerStats(data);
      } catch (error) {
        console.error('Failed to fetch server stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchServerStats();
    const interval = setInterval(fetchServerStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSteamLogin = () => {
    window.location.href = 'https://steamcommunity.com/openid/login?openid.ns=http://specs.openid.net/auth/2.0&openid.mode=checkid_setup&openid.return_to=' + encodeURIComponent(window.location.origin + '/auth/callback') + '&openid.realm=' + encodeURIComponent(window.location.origin) + '&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
              <Icon name="Shield" className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">CS 1.6 Server</h1>
              <p className="text-xs text-muted-foreground">Лучший сервер в СНГ</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/profile')}>
                <img src={user.avatar_url} alt={user.username} className="w-8 h-8 rounded-full" />
                <div className="text-sm">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.balance}₽</p>
                </div>
                <Icon name="ChevronRight" className="h-4 w-4 text-muted-foreground" />
              </div>
            ) : (
              <Button onClick={handleSteamLogin} className="bg-[#171a21] hover:bg-[#1b2838]">
                <Icon name="Shield" className="mr-2 h-4 w-4" />
                Войти через Steam
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-ct/50">
            <CardHeader>
              <CardTitle className="text-ct flex items-center gap-2">
                <Icon name="Users" className="h-5 w-5" />
                Игроки онлайн
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Icon name="Loader2" className="h-8 w-8 animate-spin text-ct" />
              ) : (
                <div className="text-4xl font-bold font-mono text-ct">
                  {serverStats.players_online}/{serverStats.max_players}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-t/50">
            <CardHeader>
              <CardTitle className="text-t flex items-center gap-2">
                <Icon name="Map" className="h-5 w-5" />
                Текущая карта
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Icon name="Loader2" className="h-8 w-8 animate-spin text-t" />
              ) : (
                <div className="text-3xl font-bold font-mono text-t">{serverStats.current_map}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Trophy" className="h-5 w-5 text-primary" />
                Счёт
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-bold text-ct font-mono">{serverStats.ct_score}</span>
                <span className="text-xl">:</span>
                <span className="text-3xl font-bold text-t font-mono">{serverStats.t_score}</span>
              </div>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Ежедневная рулетка</CardTitle>
            <CardDescription>Получай призы каждый день! {!user && 'Войди через Steam чтобы крутить'}</CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <CaseRoulette />
            ) : (
              <div className="text-center py-8">
                <div className="inline-block p-16 border-2 border-primary rounded-lg bg-muted/20">
                  <Icon name="Gift" className="w-24 h-24 text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium mb-4">Крути рулетку бесплатно!</p>
                  <Button size="lg" onClick={handleSteamLogin} className="bg-[#171a21] hover:bg-[#1b2838]">
                    <Icon name="Shield" className="mr-2 h-5 w-5" />
                    Войти через Steam
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Привилегии сервера</h2>
            <p className="text-muted-foreground">Выбери привилегию и получи преимущества на сервере</p>
          </div>
          <PrivilegesShop />
        </section>
      </main>
    </div>
  );
}