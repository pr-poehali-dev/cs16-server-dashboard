import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface CaseItem {
  id: number;
  name: string;
  description: string;
  rarity: string;
  type: string;
  value: number;
  chance: number;
  icon: string;
  is_active: boolean;
}

const ICON_OPTIONS = ['Gift', 'Package', 'Crown', 'Trophy', 'Star', 'Zap', 'Crosshair', 'Shield', 'Wallet', 'Sparkles'];
const RARITY_OPTIONS = ['common', 'rare', 'epic', 'legendary'];
const TYPE_OPTIONS = ['balance', 'privilege', 'weapon', 'item'];

export default function CasesAdminTab() {
  const [items, setItems] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<CaseItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rarity: 'common',
    type: 'balance',
    value: 100,
    chance: 10,
    icon: 'Gift'
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/6be6416e-17a3-458a-95a7-96c738ef321c/?action=items');
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      toast.error('Ошибка загрузки призов');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = editingItem
        ? `https://functions.poehali.dev/6be6416e-17a3-458a-95a7-96c738ef321c/?action=update`
        : `https://functions.poehali.dev/6be6416e-17a3-458a-95a7-96c738ef321c/?action=create`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: editingItem?.id
        })
      });

      if (response.ok) {
        toast.success(editingItem ? 'Приз обновлён' : 'Приз создан');
        setIsDialogOpen(false);
        resetForm();
        fetchItems();
      } else {
        toast.error('Ошибка сохранения');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот приз?')) return;

    try {
      const response = await fetch(`https://functions.poehali.dev/6be6416e-17a3-458a-95a7-96c738ef321c/?action=delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        toast.success('Приз удалён');
        fetchItems();
      } else {
        toast.error('Ошибка удаления');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    }
  };

  const openDialog = (item?: CaseItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        rarity: item.rarity,
        type: item.type,
        value: item.value,
        chance: item.chance,
        icon: item.icon
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      rarity: 'common',
      type: 'balance',
      value: 100,
      chance: 10,
      icon: 'Gift'
    });
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      legendary: 'bg-yellow-500/20 text-yellow-500 border-yellow-500',
      epic: 'bg-purple-500/20 text-purple-500 border-purple-500',
      rare: 'bg-blue-500/20 text-blue-500 border-blue-500',
      common: 'bg-gray-400/20 text-gray-400 border-gray-400'
    };
    return colors[rarity] || colors.common;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Управление призами рулетки</h2>
          <p className="text-sm text-muted-foreground">Настройка призов и их шансов выпадения</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Icon name="Plus" className="mr-2 h-4 w-4" />
              Добавить приз
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Редактировать приз' : 'Новый приз'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Название</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="AWP Dragon Lore"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Иконка</Label>
                  <Select value={formData.icon} onValueChange={(v) => setFormData({ ...formData, icon: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map(icon => (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            <Icon name={icon} className="h-4 w-4" />
                            {icon}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Легендарное оружие"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Редкость</Label>
                  <Select value={formData.rarity} onValueChange={(v) => setFormData({ ...formData, rarity: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RARITY_OPTIONS.map(rarity => (
                        <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Тип</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_OPTIONS.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Значение {formData.type === 'balance' && '(₽)'}</Label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Шанс выпадения (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.chance}
                    onChange={(e) => setFormData({ ...formData, chance: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                <Icon name="Save" className="mr-2 h-4 w-4" />
                Сохранить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id} className={`border-2 ${getRarityColor(item.rarity)}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Icon name={item.icon} className={`h-12 w-12 ${getRarityColor(item.rarity).split(' ')[1]}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <Badge variant="outline" className={getRarityColor(item.rarity)}>
                      {item.rarity}
                    </Badge>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="font-mono">
                      Значение: <strong>{item.value}{item.type === 'balance' && '₽'}</strong>
                    </span>
                    <span className="font-mono">
                      Шанс: <strong className="text-primary">{item.chance}%</strong>
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openDialog(item)}>
                    <Icon name="Edit" className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                    <Icon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
