import React, { useState } from 'react';
import { Settings as SettingsIcon, Link, Unlink, Globe, Moon, Sun, Clock, AlertTriangle, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useTranslation, Locale } from '@/lib/i18n';
import { useTheme, Theme } from '@/lib/theme';
import { useAuthStore, BybitConnection } from '@/stores/authStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { t, locale, setLocale } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { user, connection, setConnection, setUser } = useAuthStore();
  
  const [environment, setEnvironment] = useState<'mainnet' | 'testnet'>('testnet');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [pollInterval, setPollInterval] = useState(user?.pollIntervalSeconds || 45);
  
  const isConnected = connection && !connection.revokedAt;
  
  const handleConnect = async () => {
    if (!apiKey || !apiSecret) {
      toast.error('Please enter API Key and Secret');
      return;
    }
    
    setIsConnecting(true);
    
    try {
      // Simulate API verification - will be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock connection
      const newConnection: BybitConnection = {
        id: crypto.randomUUID(),
        environment,
        apiKeyLast4: apiKey.slice(-4),
        createdAt: new Date().toISOString(),
        revokedAt: null,
        lastSyncAt: null,
      };
      
      setConnection(newConnection);
      setApiKey('');
      setApiSecret('');
      toast.success('Bybit connected successfully!');
    } catch (error) {
      toast.error('Failed to connect. Please check your credentials.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleRevoke = async () => {
    if (!connection) return;
    
    setIsRevoking(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setConnection({
        ...connection,
        revokedAt: new Date().toISOString(),
      });
      
      toast.success('API keys revoked');
    } catch (error) {
      toast.error('Failed to revoke keys');
    } finally {
      setIsRevoking(false);
    }
  };
  
  const handleSavePreferences = () => {
    if (user) {
      setUser({
        ...user,
        locale,
        theme,
        pollIntervalSeconds: pollInterval,
      });
      toast.success('Preferences saved');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <SettingsIcon className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {t('settings.title')}
        </h1>
      </div>
      
      {/* Bybit Connection */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground text-lg flex items-center gap-2">
            {isConnected ? (
              <CheckCircle className="h-5 w-5 text-profit" />
            ) : (
              <XCircle className="h-5 w-5 text-muted-foreground" />
            )}
            {t('settings.bybitConnection')}
          </CardTitle>
          <CardDescription>
            {t('settings.readOnlyWarning')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isConnected ? (
            <>
              {/* Connected state */}
              <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('settings.status')}</span>
                  <span className="flex items-center gap-2 text-profit">
                    <div className="status-dot status-connected" />
                    {t('settings.connected')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('settings.environment')}</span>
                  <span className="font-mono text-foreground">
                    {connection.environment === 'mainnet' ? t('settings.mainnet') : t('settings.testnet')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('settings.apiKey')}</span>
                  <span className="font-mono text-foreground">
                    ****{connection.apiKeyLast4}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('settings.connectedAt')}</span>
                  <span className="text-foreground">
                    {new Date(connection.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {connection.lastSyncAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('settings.lastSync')}</span>
                    <span className="text-foreground">
                      {new Date(connection.lastSyncAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleRevoke}
                disabled={isRevoking}
              >
                <Unlink className="h-4 w-4 mr-2" />
                {isRevoking ? t('settings.revoking') : t('settings.revoke')}
              </Button>
            </>
          ) : (
            <>
              {/* Connection form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('settings.environment')}</Label>
                  <Select value={environment} onValueChange={(v: 'mainnet' | 'testnet') => setEnvironment(v)}>
                    <SelectTrigger className="bg-muted/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="testnet">{t('settings.testnet')}</SelectItem>
                      <SelectItem value="mainnet">{t('settings.mainnet')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>{t('settings.apiKey')}</Label>
                  <Input
                    variant="glass"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="xxxxxxxx"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{t('settings.apiSecret')}</Label>
                  <div className="relative">
                    <Input
                      variant="glass"
                      type={showSecret ? 'text' : 'password'}
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                {/* Warning */}
                <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                  <p className="text-xs text-warning">
                    Only use read-only API keys. Do not enable trading permissions.
                    Your keys are encrypted and stored securely.
                  </p>
                </div>
                
                <Button 
                  variant="glow" 
                  className="w-full"
                  onClick={handleConnect}
                  disabled={isConnecting || !apiKey || !apiSecret}
                >
                  <Link className="h-4 w-4 mr-2" />
                  {isConnecting ? t('settings.connecting') : t('settings.connect')}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Preferences */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">
            {t('settings.preferences')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t('settings.language')}
            </Label>
            <div className="flex gap-2">
              <Button
                variant={locale === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLocale('en')}
              >
                English
              </Button>
              <Button
                variant={locale === 'ru' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLocale('ru')}
              >
                Русский
              </Button>
            </div>
          </div>
          
          {/* Theme */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {t('settings.theme')}
            </Label>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                <Sun className="h-4 w-4 mr-1" />
                {t('settings.light')}
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-4 w-4 mr-1" />
                {t('settings.dark')}
              </Button>
            </div>
          </div>
          
          {/* Poll Interval */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t('settings.pollInterval')}
            </Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[pollInterval]}
                onValueChange={([value]) => setPollInterval(value)}
                min={30}
                max={60}
                step={5}
                className="flex-1"
              />
              <span className="font-mono text-sm w-12 text-right">
                {pollInterval}s
              </span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" onClick={handleSavePreferences}>
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
