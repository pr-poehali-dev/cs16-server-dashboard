import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function PublicHome() {
  const [user, setUser] = useState<any>(null);
  const [serverStats, setServerStats] = useState({
    players_online: 16,
    max_players: 32,
    current_map: 'de_dust2',
    ct_score: 8,
    t_score: 7
  });

  const handleSteamLogin = () => {
    alert('Авторизация через Steam будет доступна после добавления STEAM_API_KEY в секреты проекта');
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
              <div className="flex items-center gap-3">
                <img src={user.avatar_url} alt={user.username} className="w-8 h-8 rounded-full" />
                <div className="text-sm">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.balance}₽</p>
                </div>
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
              <div className="text-4xl font-bold font-mono text-ct">
                {serverStats.players_online}/{serverStats.max_players}
              </div>
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
              <div className="text-3xl font-bold font-mono text-t">{serverStats.current_map}</div>
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
            <CardDescription>Получай призы каждый день! Войди через Steam чтобы крутить</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="inline-block p-16 border-2 border-primary rounded-lg bg-muted/20">
                <Icon name="Gift" className="w-24 h-24 text-primary mx-auto mb-4" />
                <p className="text-lg font-medium mb-4">Крути рулетку бесплатно!</p>
                {user ? (
                  <Button size="lg" className="bg-primary">
                    <Icon name="RotateCw" className="mr-2 h-5 w-5" />
                    Крутить рулетку
                  </Button>
                ) : (
                  <Button size="lg" onClick={handleSteamLogin} className="bg-[#171a21] hover:bg-[#1b2838]">
                    <Icon name="Shield" className="mr-2 h-5 w-5" />
                    Войти через Steam
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Способы пополнения</CardTitle>
              <CardDescription>Пополни баланс и получи привилегии</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="CreditCard" className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Банковская карта</p>
                    <p className="text-sm text-muted-foreground">Мгновенное пополнение</p>
                  </div>
                </div>
                <Badge>Доступно</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="Smartphone" className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Криптовалюта</p>
                    <p className="text-sm text-muted-foreground">BTC, ETH, USDT</p>
                  </div>
                </div>
                <Badge>Доступно</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Привилегии</CardTitle>
              <CardDescription>Доступные привилегии на сервере</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-blue-500/50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-500">VIP</p>
                  <p className="text-sm text-muted-foreground">Доступ к VIP оружию, респавн</p>
                </div>
                <span className="font-mono font-bold">500₽</span>
              </div>

              <div className="flex items-center justify-between p-3 border border-purple-500/50 rounded-lg">
                <div>
                  <p className="font-medium text-purple-500">Premium</p>
                  <p className="text-sm text-muted-foreground">VIP + HP/Броня, иммунитет к флешкам</p>
                </div>
                <span className="font-mono font-bold">1000₽</span>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
