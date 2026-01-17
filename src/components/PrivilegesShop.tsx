import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { PaymentButton } from '@/components/extensions/yookassa/PaymentButton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ShopItem {
  id: number;
  name: string;
  privilege_level: string;
  duration_days: number;
  price: number;
  description: string;
  features: string[];
}

export default function PrivilegesShop() {
  const { user } = useAuth();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/b7b7a6dc-f934-40de-b4b6-157c26481532/?action=shop_items');
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Failed to fetch shop items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPrivilegeColor = (privilege: string) => {
    const colors: Record<string, string> = {
      admin: 'border-red-500/50 bg-red-500/10',
      moderator: 'border-orange-500/50 bg-orange-500/10',
      premium: 'border-purple-500/50 bg-purple-500/10',
      vip: 'border-blue-500/50 bg-blue-500/10',
      user: 'border-gray-400/50 bg-gray-400/10'
    };
    return colors[privilege] || colors.user;
  };

  const getPrivilegeBadgeColor = (privilege: string) => {
    const colors: Record<string, string> = {
      admin: 'text-red-500',
      moderator: 'text-orange-500',
      premium: 'text-purple-500',
      vip: 'text-blue-500',
      user: 'text-gray-400'
    };
    return colors[privilege] || colors.user;
  };

  const handleSuccess = (orderNumber: string) => {
    toast.success(`Оплата успешна! Номер заказа: ${orderNumber}`);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <Card key={item.id} className={`border-2 ${getPrivilegeColor(item.privilege_level)}`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className={`text-xl ${getPrivilegeBadgeColor(item.privilege_level)}`}>
                  {item.name}
                </CardTitle>
                <CardDescription className="mt-1">{item.description}</CardDescription>
              </div>
              <Icon name="Crown" className={`h-8 w-8 ${getPrivilegeBadgeColor(item.privilege_level)}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Возможности:</p>
              <ul className="space-y-1">
                {item.features.map((feature, idx) => (
                  <li key={idx} className="text-sm flex items-center gap-2">
                    <Icon name="Check" className="h-3 w-3 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-2xl font-bold font-mono text-primary">{item.price}₽</p>
                <p className="text-xs text-muted-foreground">{item.duration_days} дней</p>
              </div>
              
              {user ? (
                <PaymentButton
                  apiUrl="https://functions.poehali.dev/d44da151-e91a-4082-a31b-64abe5037a98"
                  amount={item.price}
                  userEmail={user.steam_id + '@steam.local'}
                  userName={user.username}
                  returnUrl={window.location.origin + '/profile'}
                  cartItems={[{
                    id: item.id.toString(),
                    name: item.name,
                    price: item.price,
                    quantity: 1
                  }]}
                  onSuccess={handleSuccess}
                  buttonText="Купить"
                />
              ) : (
                <Button disabled>
                  Войдите для покупки
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}