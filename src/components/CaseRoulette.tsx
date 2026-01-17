import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import BACKEND_URLS from '../../backend/func2url.json';

interface CaseItem {
  id: number;
  name: string;
  description: string;
  rarity: string;
  type: string;
  value: number;
  chance: number;
  icon: string;
}

export default function CaseRoulette() {
  const { user } = useAuth();
  const [items, setItems] = useState<CaseItem[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [wonItem, setWonItem] = useState<CaseItem | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const rouletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchItems();
    checkSpinAvailability();
  }, [user]);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${BACKEND_URLS['cases']}/?action=items`);
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Failed to fetch case items:', error);
    }
  };

  const checkSpinAvailability = () => {
    if (!user?.last_daily_spin) {
      setCanSpin(true);
      return;
    }

    const lastSpin = new Date(user.last_daily_spin);
    const now = new Date();
    const diff = 24 * 60 * 60 * 1000 - (now.getTime() - lastSpin.getTime());

    if (diff <= 0) {
      setCanSpin(true);
      setTimeLeft('');
    } else {
      setCanSpin(false);
      updateTimeLeft(diff);
    }
  };

  const updateTimeLeft = (ms: number) => {
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    setTimeLeft(`${hours}ч ${minutes}м`);
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      legendary: 'border-yellow-500 bg-yellow-500/10',
      epic: 'border-purple-500 bg-purple-500/10',
      rare: 'border-blue-500 bg-blue-500/10',
      common: 'border-gray-400 bg-gray-400/10'
    };
    return colors[rarity] || colors.common;
  };

  const getIconColor = (rarity: string) => {
    const colors: Record<string, string> = {
      legendary: 'text-yellow-500',
      epic: 'text-purple-500',
      rare: 'text-blue-500',
      common: 'text-gray-400'
    };
    return colors[rarity] || colors.common;
  };

  const handleSpin = async () => {
    if (!user || !canSpin || spinning) return;

    setSpinning(true);
    setWonItem(null);

    try {
      const response = await fetch(`${BACKEND_URLS['cases']}/?action=spin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });

      const data = await response.json();

      if (response.status === 429) {
        setCanSpin(false);
        setTimeLeft(data.time_left);
        setSpinning(false);
        return;
      }

      if (data.item) {
        const duplicatedItems = [
          ...items, ...items, ...items, ...items, ...items,
          data.item,
          ...items, ...items
        ];

        if (rouletteRef.current) {
          const itemWidth = 140;
          const offset = duplicatedItems.length * itemWidth - (itemWidth * 7.5);
          rouletteRef.current.style.transition = 'none';
          rouletteRef.current.style.transform = 'translateX(0)';

          setTimeout(() => {
            if (rouletteRef.current) {
              rouletteRef.current.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
              rouletteRef.current.style.transform = `translateX(-${offset}px)`;
            }
          }, 50);

          setTimeout(() => {
            setWonItem(data.item);
            setSpinning(false);
            setCanSpin(false);
            checkSpinAvailability();
            
            const updatedUser = { ...user };
            if (data.item.type === 'balance') {
              updatedUser.balance += data.item.value;
            } else if (data.item.type === 'privilege') {
              updatedUser.privilege = data.item.name.toLowerCase().split(' ')[0];
            }
            updatedUser.last_daily_spin = new Date().toISOString();
            localStorage.setItem('cs16_user', JSON.stringify(updatedUser));
          }, 4100);
        }
      }
    } catch (error) {
      console.error('Spin failed:', error);
      setSpinning(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const duplicatedItems = spinning
    ? [...items, ...items, ...items, ...items, ...items, wonItem!, ...items, ...items]
    : items;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-lg border-2 border-primary bg-muted/20 p-8">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary z-10 -translate-x-1/2" />
        
        <div className="overflow-hidden">
          <div
            ref={rouletteRef}
            className="flex gap-4 transition-transform"
            style={{ transform: 'translateX(0)' }}
          >
            {duplicatedItems.map((item, index) => (
              <Card
                key={`${item?.id}-${index}`}
                className={`min-w-[120px] p-4 flex flex-col items-center justify-center gap-2 ${
                  item ? getRarityColor(item.rarity) : 'border-gray-400'
                }`}
              >
                <Icon
                  name={item?.icon || 'Package'}
                  className={`h-12 w-12 ${item ? getIconColor(item.rarity) : 'text-gray-400'}`}
                />
                <p className="text-xs font-medium text-center line-clamp-2">
                  {item?.name || 'Empty'}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        {wonItem && (
          <div className="animate-bounce">
            <Card className={`inline-block p-6 ${getRarityColor(wonItem.rarity)}`}>
              <div className="flex flex-col items-center gap-3">
                <Icon name={wonItem.icon} className={`h-16 w-16 ${getIconColor(wonItem.rarity)}`} />
                <div>
                  <p className="text-xl font-bold">{wonItem.name}</p>
                  <p className="text-sm text-muted-foreground">{wonItem.description}</p>
                  {wonItem.type === 'balance' && (
                    <p className="text-lg font-mono font-bold text-primary mt-2">+{wonItem.value}₽</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {canSpin ? (
          <Button
            size="lg"
            onClick={handleSpin}
            disabled={!user || spinning}
            className="bg-primary text-primary-foreground text-lg px-8 py-6"
          >
            {spinning ? (
              <>
                <Icon name="Loader2" className="mr-2 h-5 w-5 animate-spin" />
                Крутим...
              </>
            ) : (
              <>
                <Icon name="RotateCw" className="mr-2 h-5 w-5" />
                Крутить рулетку
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-muted-foreground">Следующая попытка через:</p>
            <p className="text-2xl font-mono font-bold text-primary">{timeLeft}</p>
          </div>
        )}
      </div>
    </div>
  );
}
