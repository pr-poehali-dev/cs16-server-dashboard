import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Player {
  id: number;
  name: string;
  team: 'CT' | 'T';
  kills: number;
  deaths: number;
  rating: number;
  health: number;
  armor: number;
  ping: number;
}

interface CaseItem {
  id: number;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  value: number;
  type: 'weapon' | 'privilege' | 'balance';
}

const mockPlayers: Player[] = [
  { id: 1, name: 'Player_2003', team: 'CT', kills: 24, deaths: 12, rating: 1850, health: 100, armor: 100, ping: 15 },
  { id: 2, name: 'Pro_Gamer', team: 'CT', kills: 18, deaths: 15, rating: 1620, health: 78, armor: 50, ping: 22 },
  { id: 3, name: 'Sniper_King', team: 'T', kills: 21, deaths: 14, rating: 1720, health: 100, armor: 85, ping: 18 },
  { id: 4, name: 'Rush_B', team: 'T', kills: 15, deaths: 18, rating: 1450, health: 45, armor: 0, ping: 35 },
  { id: 5, name: 'AWP_Master', team: 'CT', kills: 20, deaths: 10, rating: 1920, health: 100, armor: 100, ping: 12 },
  { id: 6, name: 'Ninja_Defuse', team: 'T', kills: 12, deaths: 20, rating: 1280, health: 22, armor: 15, ping: 45 },
];

const mockBans = [
  { id: 1, player: 'Cheater_228', reason: 'WallHack', admin: 'Admin', date: '18.01.2026 14:23', duration: 'Permanent' },
  { id: 2, player: 'Toxic_Player', reason: 'Оскорбления', admin: 'Moderator', date: '18.01.2026 12:10', duration: '7 дней' },
  { id: 3, player: 'AFK_Bot', reason: 'AFK', admin: 'Admin', date: '17.01.2026 20:45', duration: '1 день' },
];

const mockMaps = [
  { name: 'de_dust2', status: 'active', players: 16 },
  { name: 'de_inferno', status: 'inactive', players: 0 },
  { name: 'de_nuke', status: 'inactive', players: 0 },
  { name: 'de_mirage', status: 'inactive', players: 0 },
];

const caseItems: CaseItem[] = [
  { id: 1, name: 'AWP Dragon Lore', rarity: 'legendary', value: 5000, type: 'weapon' },
  { id: 2, name: 'AK-47 Fire Serpent', rarity: 'epic', value: 2000, type: 'weapon' },
  { id: 3, name: 'VIP на месяц', rarity: 'rare', value: 500, type: 'privilege' },
  { id: 4, name: '1000 рублей', rarity: 'epic', value: 1000, type: 'balance' },
  { id: 5, name: 'M4A4 Howl', rarity: 'legendary', value: 3000, type: 'weapon' },
  { id: 6, name: '100 рублей', rarity: 'common', value: 100, type: 'balance' },
  { id: 7, name: 'Admin на день', rarity: 'epic', value: 1500, type: 'privilege' },
  { id: 8, name: 'Desert Eagle Blaze', rarity: 'rare', value: 800, type: 'weapon' },
];

const rarityColors = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-amber-500'
};

export default function Index() {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonItem, setWonItem] = useState<CaseItem | null>(null);

  const openCase = () => {
    setIsSpinning(true);
    setWonItem(null);
    
    setTimeout(() => {
      const randomItem = caseItems[Math.floor(Math.random() * caseItems.length)];
      setWonItem(randomItem);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded flex items-center justify-center">
              <Icon name="Shield" className="text-primary-foreground" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">CS 1.6 Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Server Management Dashboard</p>
            </div>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2 border-green-500 text-green-500">
            <Icon name="Circle" className="w-3 h-3 fill-green-500 mr-2" />
            ONLINE
          </Badge>
        </header>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-muted p-2 h-auto">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="LayoutDashboard" className="mr-2 h-4 w-4" />
              Дашборд
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Users" className="mr-2 h-4 w-4" />
              Игроки
            </TabsTrigger>
            <TabsTrigger value="bans" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Ban" className="mr-2 h-4 w-4" />
              Баны
            </TabsTrigger>
            <TabsTrigger value="maps" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Map" className="mr-2 h-4 w-4" />
              Карты
            </TabsTrigger>
            <TabsTrigger value="cases" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Package" className="mr-2 h-4 w-4" />
              Кейсы
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Settings" className="mr-2 h-4 w-4" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-ct/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Игроков онлайн</CardTitle>
                  <Icon name="Users" className="h-4 w-4 text-ct" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-mono text-ct">16/32</div>
                  <Progress value={50} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card className="border-t/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Текущая карта</CardTitle>
                  <Icon name="Map" className="h-4 w-4 text-t" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-mono text-t">de_dust2</div>
                  <p className="text-xs text-muted-foreground mt-1">Осталось: 12:34</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Средний пинг</CardTitle>
                  <Icon name="Activity" className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-mono text-green-500">24ms</div>
                  <p className="text-xs text-muted-foreground mt-1">Отличное соединение</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Активных банов</CardTitle>
                  <Icon name="Ban" className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-mono text-destructive">3</div>
                  <p className="text-xs text-muted-foreground mt-1">За последние 24 часа</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Счёт раунда</CardTitle>
                <CardDescription>Текущая игра на de_dust2</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-ct font-mono">8</div>
                    <Badge className="mt-2 bg-ct text-white">Counter-Terrorists</Badge>
                  </div>
                  <div className="text-4xl text-muted-foreground">:</div>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-t font-mono">7</div>
                    <Badge className="mt-2 bg-t text-white">Terrorists</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="players" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Игроки на сервере</CardTitle>
                <CardDescription>Управление активными игроками</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Игрок</TableHead>
                      <TableHead>Команда</TableHead>
                      <TableHead className="text-center">K/D</TableHead>
                      <TableHead className="text-center">Рейтинг</TableHead>
                      <TableHead>Состояние</TableHead>
                      <TableHead className="text-center">Пинг</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPlayers.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell className="font-medium font-mono">{player.name}</TableCell>
                        <TableCell>
                          <Badge className={player.team === 'CT' ? 'bg-ct' : 'bg-t'}>
                            {player.team}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {player.kills}/{player.deaths}
                        </TableCell>
                        <TableCell className="text-center font-mono font-bold text-primary">
                          {player.rating}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Icon name="Heart" className="w-3 h-3 text-red-500" />
                              <Progress value={player.health} className="h-1.5 flex-1" />
                              <span className="text-xs font-mono w-8">{player.health}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="Shield" className="w-3 h-3 text-blue-500" />
                              <Progress value={player.armor} className="h-1.5 flex-1" />
                              <span className="text-xs font-mono w-8">{player.armor}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={player.ping < 30 ? 'default' : 'destructive'} className="font-mono">
                            {player.ping}ms
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Icon name="Eye" className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Статистика игрока</DialogTitle>
                                <DialogDescription>{player.name}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Убийств</p>
                                    <p className="text-2xl font-bold font-mono">{player.kills}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Смертей</p>
                                    <p className="text-2xl font-bold font-mono">{player.deaths}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">K/D Ratio</p>
                                    <p className="text-2xl font-bold font-mono">{(player.kills / player.deaths).toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Рейтинг</p>
                                    <p className="text-2xl font-bold font-mono text-primary">{player.rating}</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="destructive" size="sm">
                            <Icon name="UserX" className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bans" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Банлист</CardTitle>
                <CardDescription>История банов и активные блокировки</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Игрок</TableHead>
                      <TableHead>Причина</TableHead>
                      <TableHead>Администратор</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Срок</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBans.map((ban) => (
                      <TableRow key={ban.id}>
                        <TableCell className="font-medium font-mono">{ban.player}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{ban.reason}</Badge>
                        </TableCell>
                        <TableCell>{ban.admin}</TableCell>
                        <TableCell className="text-sm text-muted-foreground font-mono">{ban.date}</TableCell>
                        <TableCell>
                          <Badge variant={ban.duration === 'Permanent' ? 'destructive' : 'secondary'}>
                            {ban.duration}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <Icon name="Trash2" className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maps" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Ротация карт</CardTitle>
                <CardDescription>Управление картами сервера</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {mockMaps.map((map, idx) => (
                    <Card key={idx} className={map.status === 'active' ? 'border-primary' : ''}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="font-mono text-lg">{map.name}</CardTitle>
                          {map.status === 'active' && (
                            <Badge className="bg-primary">
                              <Icon name="Circle" className="w-2 h-2 fill-white mr-1" />
                              Активна
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Игроков:</span>
                          <span className="font-mono font-bold">{map.players}/32</span>
                        </div>
                        {map.status === 'inactive' && (
                          <Button className="w-full bg-primary">
                            <Icon name="Play" className="mr-2 h-4 w-4" />
                            Загрузить карту
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cases" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Кейсы удачи</CardTitle>
                <CardDescription>Открой кейс и получи приз!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative overflow-hidden rounded-lg border-2 border-primary bg-card p-8">
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary z-10" style={{ transform: 'translateX(-50%)' }}></div>
                  
                  <div className={`flex gap-4 ${isSpinning ? 'animate-spin-case' : ''}`}>
                    {[...caseItems, ...caseItems].map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex-shrink-0 w-32 h-32 rounded border-2 ${rarityColors[item.rarity]} p-3 flex flex-col items-center justify-center text-center`}
                      >
                        <Icon name={item.type === 'weapon' ? 'Crosshair' : item.type === 'privilege' ? 'Crown' : 'DollarSign'} className="w-8 h-8 mb-2" />
                        <p className="text-xs font-bold text-white">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <Button 
                    size="lg" 
                    className="bg-primary text-primary-foreground px-8 py-6 text-lg font-bold"
                    onClick={openCase}
                    disabled={isSpinning}
                  >
                    {isSpinning ? (
                      <>
                        <Icon name="Loader2" className="mr-2 h-5 w-5 animate-spin" />
                        Открываем...
                      </>
                    ) : (
                      <>
                        <Icon name="Package" className="mr-2 h-5 w-5" />
                        Открыть кейс (500₽)
                      </>
                    )}
                  </Button>

                  {wonItem && (
                    <Card className={`border-2 ${rarityColors[wonItem.rarity]} animate-fade-in`}>
                      <CardHeader>
                        <CardTitle className="text-center">🎉 Поздравляем!</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center space-y-2">
                        <Icon name={wonItem.type === 'weapon' ? 'Crosshair' : wonItem.type === 'privilege' ? 'Crown' : 'DollarSign'} className="w-16 h-16 mx-auto text-primary" />
                        <p className="text-2xl font-bold">{wonItem.name}</p>
                        <Badge className={rarityColors[wonItem.rarity]}>
                          {wonItem.rarity.toUpperCase()}
                        </Badge>
                        <p className="text-lg font-mono text-muted-foreground">Стоимость: {wonItem.value}₽</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Настройки сервера</CardTitle>
                <CardDescription>Конфигурация и параметры</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Название сервера</label>
                    <Input defaultValue="[RU] CS 1.6 Dust2 Only | 128tick" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Максимум игроков</label>
                    <Select defaultValue="32">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16">16</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                        <SelectItem value="32">32</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Режим игры</label>
                    <Select defaultValue="competitive">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="competitive">Competitive</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="deathmatch">Deathmatch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Время раунда (сек)</label>
                    <Input type="number" defaultValue="180" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button className="bg-primary">
                    <Icon name="Save" className="mr-2 h-4 w-4" />
                    Сохранить настройки
                  </Button>
                  <Button variant="destructive">
                    <Icon name="RotateCcw" className="mr-2 h-4 w-4" />
                    Перезапустить сервер
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}