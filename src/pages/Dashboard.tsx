import React from 'react';
import { RefreshCw, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, MetricCard } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    connection, 
    balances, 
    positions, 
    openOrders, 
    lastSyncAt, 
    isSyncing,
    setIsSyncing,
    setLastSyncAt,
    setBalances,
    setPositions,
    setOpenOrders,
  } = useAuthStore();
  
  const isConnected = connection && !connection.revokedAt;
  
  // Calculate totals
  const totalEquity = balances.reduce((sum, b) => sum + parseFloat(b.equity || '0'), 0);
  const totalAvailable = balances.reduce((sum, b) => sum + parseFloat(b.availableBalance || '0'), 0);
  const totalUnrealizedPnL = balances.reduce((sum, b) => sum + parseFloat(b.unrealisedPnl || '0'), 0);
  const marginUsed = totalEquity - totalAvailable;
  
  const handleSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    
    // Simulate sync - will be replaced with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock data for demonstration
    setBalances([
      {
        coin: 'USDT',
        walletBalance: '10000.00',
        availableBalance: '7500.00',
        equity: '10250.00',
        unrealisedPnl: '250.00',
        marginBalance: '2500.00',
      },
    ]);
    
    setPositions([
      {
        symbol: 'BTCUSDT',
        side: 'Buy',
        size: '0.1',
        entryPrice: '42000.00',
        markPrice: '42500.00',
        unrealisedPnl: '50.00',
        leverage: '10',
        positionMargin: '420.00',
        liqPrice: '38000.00',
        takeProfit: '45000.00',
        stopLoss: '41000.00',
        createdTime: new Date().toISOString(),
      },
      {
        symbol: 'ETHUSDT',
        side: 'Buy',
        size: '1.5',
        entryPrice: '2200.00',
        markPrice: '2280.00',
        unrealisedPnl: '120.00',
        leverage: '5',
        positionMargin: '660.00',
        liqPrice: '1900.00',
        takeProfit: '2500.00',
        stopLoss: '2100.00',
        createdTime: new Date().toISOString(),
      },
    ]);
    
    setOpenOrders([
      {
        orderId: '1',
        symbol: 'BTCUSDT',
        side: 'Sell',
        orderType: 'Limit',
        price: '44000.00',
        qty: '0.05',
        cumExecQty: '0',
        orderStatus: 'New',
        createdTime: new Date().toISOString(),
      },
    ]);
    
    setLastSyncAt(new Date().toISOString());
    setIsSyncing(false);
  };
  
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="text-center space-y-4">
          <div className="p-4 rounded-full bg-muted inline-block">
            <LinkIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            {t('dashboard.noConnection')}
          </h2>
          <Button variant="glow" onClick={() => navigate('/settings')}>
            {t('dashboard.connectBybit')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('dashboard.title')}
          </h1>
          {lastSyncAt && (
            <p className="text-sm text-muted-foreground">
              {t('dashboard.lastSync')}: {new Date(lastSyncAt).toLocaleString()}
            </p>
          )}
        </div>
        <Button 
          variant="outline" 
          onClick={handleSync}
          disabled={isSyncing}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isSyncing && "animate-spin")} />
          {isSyncing ? t('dashboard.syncing') : t('dashboard.syncNow')}
        </Button>
      </div>
      
      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          label={t('dashboard.totalEquity')}
          value={formatNumber(totalEquity)}
          prefix="$"
        />
        <MetricCard 
          label={t('dashboard.availableBalance')}
          value={formatNumber(totalAvailable)}
          prefix="$"
        />
        <MetricCard 
          label={t('dashboard.unrealizedPnL')}
          value={formatNumber(totalUnrealizedPnL)}
          prefix="$"
          change={totalEquity > 0 ? (totalUnrealizedPnL / totalEquity) * 100 : 0}
        />
        <MetricCard 
          label={t('dashboard.marginUsed')}
          value={formatNumber(marginUsed)}
          prefix="$"
        />
      </div>
      
      {/* Positions and Orders */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Open Positions */}
        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-foreground text-base font-semibold">
              {t('dashboard.openPositions')} ({positions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {positions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t('positions.noPositions')}
              </p>
            ) : (
              <div className="space-y-3">
                {positions.slice(0, 5).map((pos, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        pos.side === 'Buy' ? "bg-profit/20 text-profit" : "bg-loss/20 text-loss"
                      )}>
                        {pos.side === 'Buy' ? t('positions.long') : t('positions.short')}
                      </span>
                      <span className="font-medium text-foreground">{pos.symbol}</span>
                      <span className="text-xs text-muted-foreground">{pos.leverage}x</span>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "font-mono text-sm",
                        parseFloat(pos.unrealisedPnl) >= 0 ? "text-profit" : "text-loss"
                      )}>
                        {parseFloat(pos.unrealisedPnl) >= 0 ? '+' : ''}${formatNumber(parseFloat(pos.unrealisedPnl))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {pos.size} @ ${formatNumber(parseFloat(pos.entryPrice))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Active Orders */}
        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-foreground text-base font-semibold">
              {t('dashboard.activeOrders')} ({openOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {openOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t('orders.noOrders')}
              </p>
            ) : (
              <div className="space-y-3">
                {openOrders.slice(0, 5).map((order, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        order.side === 'Buy' ? "bg-profit/20 text-profit" : "bg-loss/20 text-loss"
                      )}>
                        {order.side === 'Buy' ? t('orders.buy') : t('orders.sell')}
                      </span>
                      <span className="font-medium text-foreground">{order.symbol}</span>
                      <span className="text-xs text-muted-foreground">{order.orderType}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-foreground">
                        {order.qty} @ ${formatNumber(parseFloat(order.price))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.orderStatus}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
