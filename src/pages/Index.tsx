import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import DashboardTab from '@/components/server/DashboardTab';
import PlayersTab from '@/components/server/PlayersTab';
import CasesTab from '@/components/server/CasesTab';
import CasesAdminTab from '@/components/server/CasesAdminTab';
import ShopAdminTab from '@/components/server/ShopAdminTab';
import { BansTab, MapsTab, SettingsTab } from '@/components/server/ServerTabs';

export default function Index() {
  const { user, isAdmin, loading } = useAuth();
  const [selectedTab, setSelectedTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <Icon name="ShieldAlert" className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium mb-2">Доступ запрещён</p>
            <p className="text-sm text-muted-foreground mb-4">
              Админ-панель доступна только администраторам сервера.
            </p>
            <Button onClick={() => window.location.href = '/'} variant="outline" size="sm">
              <Icon name="Home" className="mr-2 h-4 w-4" />
              На главную
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2 border-green-500 text-green-500">
              <Icon name="Circle" className="w-3 h-3 fill-green-500 mr-2" />
              ONLINE
            </Badge>
            <div className="flex items-center gap-2">
              <img src={user.avatar_url} alt={user.username} className="w-8 h-8 rounded-full" />
              <span className="text-sm font-medium">{user.username}</span>
            </div>
          </div>
        </header>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 md:grid-cols-8 gap-2 bg-muted p-2 h-auto">
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
            <TabsTrigger value="cases-admin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Gift" className="mr-2 h-4 w-4" />
              Призы
            </TabsTrigger>
            <TabsTrigger value="shop" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="ShoppingCart" className="mr-2 h-4 w-4" />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Settings" className="mr-2 h-4 w-4" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab />
          </TabsContent>

          <TabsContent value="players">
            <PlayersTab />
          </TabsContent>

          <TabsContent value="bans">
            <BansTab />
          </TabsContent>

          <TabsContent value="maps">
            <MapsTab />
          </TabsContent>

          <TabsContent value="cases">
            <CasesTab />
          </TabsContent>

          <TabsContent value="cases-admin">
            <CasesAdminTab />
          </TabsContent>

          <TabsContent value="shop">
            <ShopAdminTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}