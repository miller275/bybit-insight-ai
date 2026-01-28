-- Users profile table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  locale TEXT DEFAULT 'en' CHECK (locale IN ('en', 'ru')),
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
  poll_interval_seconds INTEGER DEFAULT 45 CHECK (poll_interval_seconds >= 30 AND poll_interval_seconds <= 60),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Exchange connections (encrypted API keys)
CREATE TABLE public.exchange_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exchange TEXT DEFAULT 'bybit',
  environment TEXT NOT NULL CHECK (environment IN ('mainnet', 'testnet')),
  api_key_last4 TEXT NOT NULL,
  api_key_enc TEXT,
  api_secret_enc TEXT,
  iv TEXT,
  salt TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  last_sync_at TIMESTAMPTZ
);

-- Risk profiles
CREATE TABLE public.risk_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  max_risk_per_trade_pct NUMERIC DEFAULT 1.0,
  daily_loss_limit_pct NUMERIC DEFAULT 3.0,
  max_leverage INTEGER DEFAULT 5,
  max_open_positions INTEGER DEFAULT 5,
  whitelist_symbols TEXT[] DEFAULT ARRAY['BTCUSDT', 'ETHUSDT'],
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Snapshots for balances/positions/orders
CREATE TABLE public.snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  snapshot_type TEXT NOT NULL CHECK (snapshot_type IN ('balances', 'positions', 'orders')),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI conversations
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI messages
CREATE TABLE public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'tool')),
  content TEXT NOT NULL,
  tool_name TEXT,
  tool_result JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit log
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  payload JSONB,
  ip TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own connections" ON public.exchange_connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own connections" ON public.exchange_connections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own connections" ON public.exchange_connections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own connections" ON public.exchange_connections FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own risk profile" ON public.risk_profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own snapshots" ON public.snapshots FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own conversations" ON public.ai_conversations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own messages" ON public.ai_messages FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.ai_conversations WHERE id = conversation_id AND user_id = auth.uid()));

CREATE POLICY "Users can view own audit log" ON public.audit_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can insert audit log" ON public.audit_log FOR INSERT WITH CHECK (true);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email);
  INSERT INTO public.risk_profiles (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX idx_snapshots_user_type ON public.snapshots(user_id, snapshot_type, created_at DESC);
CREATE INDEX idx_audit_log_user ON public.audit_log(user_id, created_at DESC);
CREATE INDEX idx_exchange_connections_user ON public.exchange_connections(user_id);