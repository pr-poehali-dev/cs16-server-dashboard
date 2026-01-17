import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CaseItem {
  id: number;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  value: number;
  type: 'weapon' | 'privilege' | 'balance';
}

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

export default function CasesTab() {
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
    <div className="space-y-4 animate-fade-in">
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
    </div>
  );
}
