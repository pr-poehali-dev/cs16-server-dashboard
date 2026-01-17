import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

export default function DashboardTab() {
  return (
    <div className="space-y-6 animate-fade-in">
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
    </div>
  );
}
