import React, { useState } from 'react';
import { Shield, Save, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/lib/i18n';
import { useAuthStore, RiskProfile } from '@/stores/authStore';
import { toast } from 'sonner';

export default function RiskPage() {
  const { t } = useTranslation();
  const { riskProfile, setRiskProfile } = useAuthStore();
  
  const [formData, setFormData] = useState<RiskProfile>(riskProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save - will be replaced with actual API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setRiskProfile(formData);
    setIsSaving(false);
    setSaved(true);
    toast.success(t('risk.saved'));
    
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('risk.title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('risk.subtitle')}
          </p>
        </div>
      </div>
      
      <Card variant="glass">
        <CardContent className="p-6 space-y-6">
          {/* Max Risk Per Trade */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t('risk.maxRiskPerTrade')}</Label>
              <span className="font-mono text-sm text-primary">
                {formData.maxRiskPerTradePct.toFixed(1)}%
              </span>
            </div>
            <Slider
              value={[formData.maxRiskPerTradePct]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, maxRiskPerTradePct: value }))}
              min={0.5}
              max={5}
              step={0.5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Maximum percentage of account to risk on a single trade
            </p>
          </div>
          
          {/* Daily Loss Limit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t('risk.dailyLossLimit')}</Label>
              <span className="font-mono text-sm text-primary">
                {formData.dailyLossLimitPct.toFixed(1)}%
              </span>
            </div>
            <Slider
              value={[formData.dailyLossLimitPct]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, dailyLossLimitPct: value }))}
              min={1}
              max={10}
              step={0.5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              AI will warn when daily losses approach this limit
            </p>
          </div>
          
          {/* Max Leverage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t('risk.maxLeverage')}</Label>
              <span className="font-mono text-sm text-primary">
                {formData.maxLeverage}x
              </span>
            </div>
            <Slider
              value={[formData.maxLeverage]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, maxLeverage: value }))}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              AI recommendations will stay within this leverage limit
            </p>
          </div>
          
          {/* Max Open Positions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t('risk.maxOpenPositions')}</Label>
              <span className="font-mono text-sm text-primary">
                {formData.maxOpenPositions}
              </span>
            </div>
            <Slider
              value={[formData.maxOpenPositions]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, maxOpenPositions: value }))}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              AI will warn when approaching this limit
            </p>
          </div>
          
          {/* Whitelist Symbols */}
          <div className="space-y-3">
            <Label>{t('risk.whitelistSymbols')}</Label>
            <Input
              variant="glass"
              placeholder={t('risk.whitelistPlaceholder')}
              value={formData.whitelistSymbols.join(', ')}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                whitelistSymbols: e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
              }))}
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated list of symbols the AI will prioritize
            </p>
          </div>
          
          {/* Save Button */}
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            variant={saved ? "profit" : "glow"}
            className="w-full"
          >
            {saved ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('risk.saved')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? t('risk.saving') : t('risk.save')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {/* Info box */}
      <Card variant="glass" className="border-primary/20">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Note:</span> These settings guide AI recommendations only. 
            This app is read-only and cannot execute trades. All suggestions are informational and not financial advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
