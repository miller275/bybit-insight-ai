import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function SignupPage() {
  const { t, locale, setLocale } = useTranslation();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { emailRedirectTo: window.location.origin }
      });
      
      if (error) throw error;
      
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      
      <Card variant="glass" className="w-full max-w-md relative animate-fade-in">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 glow-primary">
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">AI Portfolio Assistant</CardTitle>
          <CardDescription>{t('auth.createAccount')}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t('auth.email')}</label>
              <Input type="email" variant="glass" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t('auth.password')}</label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} variant="glass" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t('auth.confirmPassword')}</label>
              <Input type={showPassword ? 'text' : 'password'} variant="glass" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
            </div>
            
            <Button type="submit" variant="glow" className="w-full" disabled={isLoading}>
              {isLoading ? t('auth.signingUp') : t('auth.createAccount')}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{t('auth.hasAccount')} </span>
            <Link to="/login" className="text-primary hover:underline">{t('auth.signIn')}</Link>
          </div>
          
          <div className="mt-4 flex justify-center gap-2">
            <Button variant={locale === 'en' ? 'secondary' : 'ghost'} size="xs" onClick={() => setLocale('en')}>EN</Button>
            <Button variant={locale === 'ru' ? 'secondary' : 'ghost'} size="xs" onClick={() => setLocale('ru')}>RU</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
