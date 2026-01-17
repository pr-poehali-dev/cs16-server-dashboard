import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import BACKEND_URLS from '../../backend/func2url.json';

interface CaseHistoryItem {
  id: number;
  item_name: string;
  rarity: string;
  value: number;
  opened_at: string;
}

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [caseHistory, setCaseHistory] = useState<CaseHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchCaseHistory();
    }
  }, [user]);

  const fetchCaseHistory = async () => {
    try {
      const response = await fetch(`${BACKEND_URLS['cases']}/?action=history&user_id=${user!.id}`);
      const data = await response.json();
      setCaseHistory(data.history || []);
    } catch (error) {
      console.error('Failed to fetch case history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      legendary: 'text-yellow-500 border-yellow-500/50',
      epic: 'text-purple-500 border-purple-500/50',
      rare: 'text-blue-500 border-blue-500/50',
      common: 'text-gray-400 border-gray-400/50'
    };
    return colors[rarity] || colors.common;
  };

  const getPrivilegeColor = (privilege: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-500',
      moderator: 'bg-orange-500',
      premium: 'bg-purple-500',
      vip: 'bg-blue-500',
      user: 'bg-gray-500'
    };
    return colors[privilege] || colors.user;
  };

  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}м`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Профиль игрока</h1>
          </div>
          <Button variant="outline" onClick={logout}>
            <Icon name="LogOut" className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex flex-col items-center text-center space-y-4">
                <img src={user.avatar_url} alt={user.username} className="w-32 h-32 rounded-full border-4 border-primary" />
                <div>
                  <CardTitle className="text-2xl">{user.username}</CardTitle>
                  <Badge className={`mt-2 ${getPrivilegeColor(user.privilege)}`}>
                    {user.privilege.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon name="Wallet" className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Баланс</span>
                </div>
                <span className="font-bold font-mono">{user.balance}₽</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon name="Clock" className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Наиграно</span>
                </div>
                <span className="font-mono">{formatPlayTime(user.play_time)}</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon name="Shield" className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Steam ID</span>
                </div>
                <span className="font-mono text-xs">{user.steam_id.slice(0, 12)}...</span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="History" className="h-5 w-5" />
                История открытий кейсов
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div className="flex justify-center py-8">
                  <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : caseHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Package" className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Вы ещё не открывали кейсы</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {caseHistory.map((item) => (
                    <div key={item.id} className={`flex items-center justify-between p-3 border rounded-lg ${getRarityColor(item.rarity)}`}>
                      <div className="flex items-center gap-3">
                        <Icon name="Gift" className="h-6 w-6" />
                        <div>
                          <p className="font-medium">{item.item_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.opened_at).toLocaleDateString('ru-RU', { 
                              day: 'numeric', 
                              month: 'short', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getRarityColor(item.rarity)}>
                        {item.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="CreditCard" className="h-5 w-5" />
              Пополнение баланса
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Button size="lg" className="h-20" variant="outline">
              <div className="flex flex-col items-center gap-2">
                <Icon name="CreditCard" className="h-6 w-6" />
                <span>Банковская карта</span>
              </div>
            </Button>
            <Button size="lg" className="h-20" variant="outline">
              <div className="flex flex-col items-center gap-2">
                <Icon name="Smartphone" className="h-6 w-6" />
                <span>Криптовалюта</span>
              </div>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
