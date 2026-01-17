import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface ShopItem {
  id: number;
  name: string;
  privilege_level: string;
  duration_days: number;
  price: number;
  description: string;
  features: string[];
  is_active: boolean;
}

export default function ShopAdminTab() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    privilege_level: 'vip',
    duration_days: 30,
    price: 500,
    description: '',
    features: ['']
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/b7b7a6dc-f934-40de-b4b6-157c26481532/?action=shop_items');
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      toast.error('Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = editingItem
        ? 'https://functions.poehali.dev/b7b7a6dc-f934-40de-b4b6-157c26481532/?action=shop_update'
        : 'https://functions.poehali.dev/b7b7a6dc-f934-40de-b4b6-157c26481532/?action=shop_create';

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: editingItem?.id,
          features: formData.features.filter(f => f.trim() !== '')
        })
      });

      if (response.ok) {
        toast.success(editingItem ? 'Товар обновлён' : 'Товар создан');
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
    if (!confirm('Удалить этот товар?')) return;

    try {
      const response = await fetch('https://functions.poehali.dev/b7b7a6dc-f934-40de-b4b6-157c26481532/?action=shop_delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        toast.success('Товар удалён');
        fetchItems();
      } else {
        toast.error('Ошибка удаления');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    }
  };

  const openDialog = (item?: ShopItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        privilege_level: item.privilege_level,
        duration_days: item.duration_days,
        price: item.price,
        description: item.description,
        features: item.features.length > 0 ? item.features : ['']
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
      privilege_level: 'vip',
      duration_days: 30,
      price: 500,
      description: '',
      features: ['']
    });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const getPrivilegeColor = (privilege: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-500/20 text-red-500 border-red-500',
      moderator: 'bg-orange-500/20 text-orange-500 border-orange-500',
      premium: 'bg-purple-500/20 text-purple-500 border-purple-500',
      vip: 'bg-blue-500/20 text-blue-500 border-blue-500',
      user: 'bg-gray-400/20 text-gray-400 border-gray-400'
    };
    return colors[privilege] || colors.user;
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
          <h2 className="text-2xl font-bold">Магазин привилегий</h2>
          <p className="text-sm text-muted-foreground">Управление товарами и ценами</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Icon name="Plus" className="mr-2 h-4 w-4" />
              Добавить товар
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Редактировать товар' : 'Новый товар'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VIP на 30 дней"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Привилегия</Label>
                  <Input
                    value={formData.privilege_level}
                    onChange={(e) => setFormData({ ...formData, privilege_level: e.target.value })}
                    placeholder="vip"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Дней</Label>
                  <Input
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Цена (₽)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="VIP привилегия на месяц"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Возможности</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                    <Icon name="Plus" className="h-4 w-4" />
                  </Button>
                </div>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="VIP оружие"
                    />
                    {formData.features.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)}>
                        <Icon name="X" className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
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
          <Card key={item.id} className={`border-2 ${getPrivilegeColor(item.privilege_level)}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Icon name="Crown" className={`h-12 w-12 mt-1 ${getPrivilegeColor(item.privilege_level).split(' ')[1]}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <Badge variant="outline" className={getPrivilegeColor(item.privilege_level)}>
                      {item.privilege_level}
                    </Badge>
                    <Badge variant="outline">{item.duration_days} дней</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <ul className="text-sm space-y-1 mb-2">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Icon name="Check" className="h-3 w-3 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <p className="font-mono font-bold text-lg text-primary">{item.price}₽</p>
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
