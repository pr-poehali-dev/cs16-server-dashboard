import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

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

export function BansTab() {
  return (
    <div className="space-y-4 animate-fade-in">
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
    </div>
  );
}

export function MapsTab() {
  return (
    <div className="space-y-4 animate-fade-in">
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
    </div>
  );
}

export function SettingsTab() {
  return (
    <div className="space-y-4 animate-fade-in">
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
    </div>
  );
}
