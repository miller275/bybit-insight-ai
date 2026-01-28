import React, { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/i18n';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

export default function PositionsPage() {
  const { t } = useTranslation();
  const { positions, lastSyncAt, isSyncing } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPositions = positions.filter(p => 
    p.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatNumber = (num: string | number, decimals = 2) => {
    const parsed = typeof num === 'string' ? parseFloat(num) : num;
    return parsed.toLocaleString(undefined, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('positions.title')}
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
      
      {/* Positions table */}
      <Card variant="glass">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('positions.symbol')}</th>
                  <th>{t('positions.side')}</th>
                  <th className="text-right">{t('positions.size')}</th>
                  <th className="text-right">{t('positions.entryPrice')}</th>
                  <th className="text-right">{t('positions.markPrice')}</th>
                  <th className="text-right">{t('positions.pnl')}</th>
                  <th className="text-right">{t('positions.leverage')}</th>
                  <th className="text-right">{t('positions.margin')}</th>
                  <th className="text-right">{t('positions.liqPrice')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredPositions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-muted-foreground">
                      {t('positions.noPositions')}
                    </td>
                  </tr>
                ) : (
                  filteredPositions.map((pos, i) => {
                    const pnl = parseFloat(pos.unrealisedPnl);
                    const entryPrice = parseFloat(pos.entryPrice);
                    const markPrice = parseFloat(pos.markPrice);
                    const pnlPercent = entryPrice > 0 
                      ? ((markPrice - entryPrice) / entryPrice * 100 * (pos.side === 'Buy' ? 1 : -1))
                      : 0;
                    
                    return (
                      <tr key={i}>
                        <td>
                          <span className="font-medium text-foreground">{pos.symbol}</span>
                        </td>
                        <td>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium",
                            pos.side === 'Buy' ? "bg-profit/20 text-profit" : "bg-loss/20 text-loss"
                          )}>
                            {pos.side === 'Buy' ? t('positions.long') : t('positions.short')}
                          </span>
                        </td>
                        <td className="text-right font-mono">{pos.size}</td>
                        <td className="text-right font-mono">${formatNumber(pos.entryPrice)}</td>
                        <td className="text-right font-mono">${formatNumber(pos.markPrice)}</td>
                        <td className={cn(
                          "text-right font-mono",
                          pnl >= 0 ? "text-profit" : "text-loss"
                        )}>
                          <div>{pnl >= 0 ? '+' : ''}${formatNumber(pnl)}</div>
                          <div className="text-xs opacity-70">
                            {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                          </div>
                        </td>
                        <td className="text-right font-mono">{pos.leverage}x</td>
                        <td className="text-right font-mono">${formatNumber(pos.positionMargin)}</td>
                        <td className="text-right font-mono text-warning">${formatNumber(pos.liqPrice)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
