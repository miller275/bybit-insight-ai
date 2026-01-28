import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

// Types for Bybit data
export interface Balance {
  coin: string;
  walletBalance: string;
  availableBalance: string;
  equity: string;
  unrealisedPnl: string;
  marginBalance: string;
}

export interface Position {
  symbol: string;
  side: 'Buy' | 'Sell';
  size: string;
  entryPrice: string;
  markPrice: string;
  unrealisedPnl: string;
  leverage: string;
  positionMargin: string;
  liqPrice: string;
  takeProfit: string;
  stopLoss: string;
  createdTime: string;
}

export interface Order {
  orderId: string;
  symbol: string;
  side: 'Buy' | 'Sell';
  orderType: string;
  price: string;
  qty: string;
  cumExecQty: string;
  orderStatus: string;
  createdTime: string;
}

export interface BybitConnection {
  id: string;
  environment: 'mainnet' | 'testnet';
  apiKeyLast4: string;
  createdAt: string;
  revokedAt: string | null;
  lastSyncAt: string | null;
}

export interface RiskProfile {
  maxRiskPerTradePct: number;
  dailyLossLimitPct: number;
  maxLeverage: number;
  maxOpenPositions: number;
  whitelistSymbols: string[];
}

export interface User {
  id: string;
  email: string;
  locale: 'en' | 'ru';
  theme: 'light' | 'dark';
  pollIntervalSeconds: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  connection: BybitConnection | null;
  balances: Balance[];
  positions: Position[];
  openOrders: Order[];
  orderHistory: Order[];
  riskProfile: RiskProfile;
  lastSyncAt: string | null;
  isSyncing: boolean;
  
  setUser: (user: User | null) => void;
  setConnection: (connection: BybitConnection | null) => void;
  setBalances: (balances: Balance[]) => void;
  setPositions: (positions: Position[]) => void;
  setOpenOrders: (orders: Order[]) => void;
  setOrderHistory: (orders: Order[]) => void;
  setRiskProfile: (profile: RiskProfile) => void;
  setLastSyncAt: (time: string | null) => void;
  setIsSyncing: (syncing: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

const defaultRiskProfile: RiskProfile = {
  maxRiskPerTradePct: 1.0,
  dailyLossLimitPct: 3.0,
  maxLeverage: 5,
  maxOpenPositions: 5,
  whitelistSymbols: ['BTCUSDT', 'ETHUSDT'],
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  connection: null,
  balances: [],
  positions: [],
  openOrders: [],
  orderHistory: [],
  riskProfile: defaultRiskProfile,
  lastSyncAt: null,
  isSyncing: false,
  
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setConnection: (connection) => set({ connection }),
  setBalances: (balances) => set({ balances }),
  setPositions: (positions) => set({ positions }),
  setOpenOrders: (openOrders) => set({ openOrders }),
  setOrderHistory: (orderHistory) => set({ orderHistory }),
  setRiskProfile: (riskProfile) => set({ riskProfile }),
  setLastSyncAt: (lastSyncAt) => set({ lastSyncAt }),
  setIsSyncing: (isSyncing) => set({ isSyncing }),
  setIsLoading: (isLoading) => set({ isLoading }),
  
  logout: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      isAuthenticated: false,
      connection: null,
      balances: [],
      positions: [],
      openOrders: [],
      orderHistory: [],
      lastSyncAt: null,
    });
  },
  
  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      set({
        user: {
          id: session.user.id,
          email: session.user.email || '',
          locale: 'en',
          theme: 'dark',
          pollIntervalSeconds: 45,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
    
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            locale: 'en',
            theme: 'dark',
            pollIntervalSeconds: 45,
          },
          isAuthenticated: true,
        });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    });
  },
}));
