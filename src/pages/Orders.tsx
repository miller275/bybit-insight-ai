import React, { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/lib/i18n';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

export default function OrdersPage() {
  const { t } = useTranslation();
  const { openOrders, orderHistory, lastSyncAt, isSyncing } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  
  const currentOrders = activeTab === 'active' ? openOrders : orderHistory;
  const filteredOrders = currentOrders.filter(o => 
    o.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatNumber = (num: string | number, decimals = 2) => {
    const parsed = typeof num === 'string' ? parseFloat(num) : num;
    return parsed.toLocaleString(undefined, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  };
  
  const formatTime = (time: string) => {
    return new Date(time).toLocaleString();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('orders.title')}
          </h1>
          {lastSyncAt && (
            <p className="text-sm text-muted-foreground">
              {t('dashboard.lastSync')}: {new Date(lastSyncAt).toLocaleString()}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              variant="glass"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-48"
            />
          </div>
          <Button variant="outline" size="icon" disabled={isSyncing}>
            <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/30">
          <TabsTrigger value="active">
            {t('orders.activeOrders')} ({openOrders.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            {t('orders.orderHistory')} ({orderHistory.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          <Card variant="glass">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('orders.symbol')}</th>
                      <th>{t('orders.side')}</th>
                      <th>{t('orders.type')}</th>
                      <th className="text-right">{t('orders.price')}</th>
                      <th className="text-right">{t('orders.qty')}</th>
                      <th className="text-right">{t('orders.filled')}</th>
                      <th>{t('orders.status')}</th>
                      <th>{t('orders.time')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-muted-foreground">
                          {t('orders.noOrders')}
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order, i) => (
                        <tr key={i}>
                          <td>
                            <span className="font-medium text-foreground">{order.symbol}</span>
                          </td>
                          <td>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-xs font-medium",
                              order.side === 'Buy' ? "bg-profit/20 text-profit" : "bg-loss/20 text-loss"
                            )}>
                              {order.side === 'Buy' ? t('orders.buy') : t('orders.sell')}
                            </span>
                          </td>
                          <td className="text-muted-foreground">{order.orderType}</td>
                          <td className="text-right font-mono">${formatNumber(order.price)}</td>
                          <td className="text-right font-mono">{order.qty}</td>
                          <td className="text-right font-mono">{order.cumExecQty}</td>
                          <td>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-xs font-medium",
                              order.orderStatus === 'Filled' && "bg-profit/20 text-profit",
                              order.orderStatus === 'Cancelled' && "bg-loss/20 text-loss",
                              order.orderStatus === 'New' && "bg-primary/20 text-primary"
                            )}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="text-muted-foreground text-sm">{formatTime(order.createdTime)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
