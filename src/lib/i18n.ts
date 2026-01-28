import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'en' | 'ru';

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useI18n = create<I18nState>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'locale-storage' }
  )
);

export const translations = {
  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      chat: 'AI Chat',
      positions: 'Positions',
      orders: 'Orders',
      risk: 'Risk Profile',
      settings: 'Settings',
      logout: 'Log out',
    },
    // Auth
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      createAccount: 'Create Account',
      signingIn: 'Signing in...',
      signingUp: 'Creating account...',
    },
    // Dashboard
    dashboard: {
      title: 'Portfolio Overview',
      totalEquity: 'Total Equity',
      availableBalance: 'Available Balance',
      unrealizedPnL: 'Unrealized P&L',
      marginUsed: 'Margin Used',
      openPositions: 'Open Positions',
      activeOrders: 'Active Orders',
      lastSync: 'Last sync',
      syncNow: 'Sync Now',
      syncing: 'Syncing...',
      noConnection: 'Connect Bybit to view portfolio',
      connectBybit: 'Connect Bybit',
    },
    // Positions
    positions: {
      title: 'Open Positions',
      symbol: 'Symbol',
      side: 'Side',
      size: 'Size',
      entryPrice: 'Entry Price',
      markPrice: 'Mark Price',
      pnl: 'P&L',
      leverage: 'Leverage',
      margin: 'Margin',
      liqPrice: 'Liq. Price',
      noPositions: 'No open positions',
      long: 'Long',
      short: 'Short',
    },
    // Orders
    orders: {
      title: 'Orders',
      activeOrders: 'Active Orders',
      orderHistory: 'Order History',
      symbol: 'Symbol',
      side: 'Side',
      type: 'Type',
      price: 'Price',
      qty: 'Qty',
      filled: 'Filled',
      status: 'Status',
      time: 'Time',
      noOrders: 'No orders',
      buy: 'Buy',
      sell: 'Sell',
    },
    // Risk
    risk: {
      title: 'Risk Profile',
      subtitle: 'Configure risk parameters for AI recommendations',
      maxRiskPerTrade: 'Max Risk Per Trade (%)',
      dailyLossLimit: 'Daily Loss Limit (%)',
      maxLeverage: 'Max Leverage',
      maxOpenPositions: 'Max Open Positions',
      whitelistSymbols: 'Whitelisted Symbols',
      whitelistPlaceholder: 'BTCUSDT, ETHUSDT...',
      save: 'Save Settings',
      saving: 'Saving...',
      saved: 'Settings saved',
    },
    // Settings
    settings: {
      title: 'Settings',
      bybitConnection: 'Bybit Connection',
      environment: 'Environment',
      mainnet: 'Mainnet',
      testnet: 'Testnet',
      apiKey: 'API Key',
      apiSecret: 'API Secret',
      connect: 'Connect',
      connecting: 'Verifying...',
      connected: 'Connected',
      disconnect: 'Disconnect',
      revoke: 'Revoke Keys',
      revoking: 'Revoking...',
      connectedAt: 'Connected',
      lastSync: 'Last sync',
      status: 'Status',
      preferences: 'Preferences',
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      pollInterval: 'Sync Interval (seconds)',
      readOnlyWarning: 'Only read-only API keys are supported. Trading is not possible.',
    },
    // Chat
    chat: {
      title: 'AI Assistant',
      placeholder: 'Ask about your portfolio, market analysis, or risk assessment...',
      send: 'Send',
      disclaimer: 'Not financial advice / Не финсовет',
      quickCommands: 'Quick Commands',
      showPositions: 'Show positions',
      showBalance: 'Show balance',
      assessRisk: 'Assess BTC risk',
      makePlan: 'Make a plan for ETH',
      thinking: 'Thinking...',
      error: 'Error occurred. Please try again.',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      confirm: 'Confirm',
      search: 'Search',
      filter: 'Filter',
      refresh: 'Refresh',
      all: 'All',
      none: 'None',
      notAvailable: 'N/A',
    },
  },
  ru: {
    // Navigation
    nav: {
      dashboard: 'Обзор',
      chat: 'AI Чат',
      positions: 'Позиции',
      orders: 'Ордера',
      risk: 'Риск профиль',
      settings: 'Настройки',
      logout: 'Выйти',
    },
    // Auth
    auth: {
      signIn: 'Войти',
      signUp: 'Регистрация',
      email: 'Email',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      forgotPassword: 'Забыли пароль?',
      noAccount: 'Нет аккаунта?',
      hasAccount: 'Уже есть аккаунт?',
      createAccount: 'Создать аккаунт',
      signingIn: 'Вход...',
      signingUp: 'Создание аккаунта...',
    },
    // Dashboard
    dashboard: {
      title: 'Обзор портфеля',
      totalEquity: 'Общий капитал',
      availableBalance: 'Доступный баланс',
      unrealizedPnL: 'Нереализ. P&L',
      marginUsed: 'Использ. маржа',
      openPositions: 'Открытые позиции',
      activeOrders: 'Активные ордера',
      lastSync: 'Последняя синхр.',
      syncNow: 'Синхронизировать',
      syncing: 'Синхронизация...',
      noConnection: 'Подключите Bybit для просмотра портфеля',
      connectBybit: 'Подключить Bybit',
    },
    // Positions
    positions: {
      title: 'Открытые позиции',
      symbol: 'Символ',
      side: 'Сторона',
      size: 'Размер',
      entryPrice: 'Цена входа',
      markPrice: 'Маркет цена',
      pnl: 'P&L',
      leverage: 'Плечо',
      margin: 'Маржа',
      liqPrice: 'Цена ликв.',
      noPositions: 'Нет открытых позиций',
      long: 'Лонг',
      short: 'Шорт',
    },
    // Orders
    orders: {
      title: 'Ордера',
      activeOrders: 'Активные ордера',
      orderHistory: 'История ордеров',
      symbol: 'Символ',
      side: 'Сторона',
      type: 'Тип',
      price: 'Цена',
      qty: 'Кол-во',
      filled: 'Исполнено',
      status: 'Статус',
      time: 'Время',
      noOrders: 'Нет ордеров',
      buy: 'Покупка',
      sell: 'Продажа',
    },
    // Risk
    risk: {
      title: 'Риск профиль',
      subtitle: 'Настройте параметры риска для AI рекомендаций',
      maxRiskPerTrade: 'Макс. риск на сделку (%)',
      dailyLossLimit: 'Дневной лимит потерь (%)',
      maxLeverage: 'Макс. плечо',
      maxOpenPositions: 'Макс. открытых позиций',
      whitelistSymbols: 'Разрешённые символы',
      whitelistPlaceholder: 'BTCUSDT, ETHUSDT...',
      save: 'Сохранить',
      saving: 'Сохранение...',
      saved: 'Настройки сохранены',
    },
    // Settings
    settings: {
      title: 'Настройки',
      bybitConnection: 'Подключение Bybit',
      environment: 'Среда',
      mainnet: 'Mainnet',
      testnet: 'Testnet',
      apiKey: 'API Ключ',
      apiSecret: 'API Секрет',
      connect: 'Подключить',
      connecting: 'Проверка...',
      connected: 'Подключено',
      disconnect: 'Отключить',
      revoke: 'Отозвать ключи',
      revoking: 'Отзыв...',
      connectedAt: 'Подключено',
      lastSync: 'Последняя синхр.',
      status: 'Статус',
      preferences: 'Предпочтения',
      language: 'Язык',
      theme: 'Тема',
      light: 'Светлая',
      dark: 'Тёмная',
      pollInterval: 'Интервал синхр. (сек)',
      readOnlyWarning: 'Поддерживаются только ключи только для чтения. Торговля невозможна.',
    },
    // Chat
    chat: {
      title: 'AI Ассистент',
      placeholder: 'Спросите о портфеле, анализе рынка или оценке рисков...',
      send: 'Отправить',
      disclaimer: 'Не финсовет / Not financial advice',
      quickCommands: 'Быстрые команды',
      showPositions: 'Покажи позиции',
      showBalance: 'Покажи баланс',
      assessRisk: 'Оцени риск BTC',
      makePlan: 'Сделай план по ETH',
      thinking: 'Думаю...',
      error: 'Произошла ошибка. Попробуйте ещё раз.',
    },
    // Common
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успешно',
      cancel: 'Отмена',
      save: 'Сохранить',
      delete: 'Удалить',
      confirm: 'Подтвердить',
      search: 'Поиск',
      filter: 'Фильтр',
      refresh: 'Обновить',
      all: 'Все',
      none: 'Нет',
      notAvailable: 'Н/Д',
    },
  },
} as const;

export function t(key: string, locale: Locale = 'en'): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value ?? key;
}

export function useTranslation() {
  const { locale, setLocale } = useI18n();
  
  return {
    locale,
    setLocale,
    t: (key: string) => t(key, locale),
  };
}
