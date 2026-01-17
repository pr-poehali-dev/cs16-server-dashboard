import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

const mockPlayers: Player[] = [
  { id: 1, name: 'Player_2003', team: 'CT', kills: 24, deaths: 12, rating: 1850, health: 100, armor: 100, ping: 15 },
  { id: 2, name: 'Pro_Gamer', team: 'CT', kills: 18, deaths: 15, rating: 1620, health: 78, armor: 50, ping: 22 },
  { id: 3, name: 'Sniper_King', team: 'T', kills: 21, deaths: 14, rating: 1720, health: 100, armor: 85, ping: 18 },
  { id: 4, name: 'Rush_B', team: 'T', kills: 15, deaths: 18, rating: 1450, health: 45, armor: 0, ping: 35 },
  { id: 5, name: 'AWP_Master', team: 'CT', kills: 20, deaths: 10, rating: 1920, health: 100, armor: 100, ping: 12 },
  { id: 6, name: 'Ninja_Defuse', team: 'T', kills: 12, deaths: 20, rating: 1280, health: 22, armor: 15, ping: 45 },
];

export default function PlayersTab() {
  return (
    <div className="space-y-4 animate-fade-in">
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
    </div>
  );
}
