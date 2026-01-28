import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';
import { useChatStore, ChatMessage } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

const quickCommands = [
  { key: 'showPositions', en: 'Show positions', ru: 'Покажи позиции' },
  { key: 'showBalance', en: 'Show balance', ru: 'Покажи баланс' },
  { key: 'assessRisk', en: 'Assess BTC risk', ru: 'Оцени риск BTC' },
  { key: 'makePlan', en: 'Make a plan for ETH', ru: 'Сделай план по ETH' },
];

export default function ChatPage() {
  const { t, locale } = useTranslation();
  const { connection, balances, positions } = useAuthStore();
  const { 
    currentConversationId, 
    createConversation, 
    addMessage, 
    getCurrentMessages,
    isLoading,
    setIsLoading,
  } = useChatStore();
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const messages = getCurrentMessages();
  const isConnected = connection && !connection.revokedAt;
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    if (!currentConversationId) {
      createConversation();
    }
  }, [currentConversationId, createConversation]);
  
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || !currentConversationId) return;
    
    setInput('');
    addMessage(currentConversationId, { role: 'user', content: trimmed });
    setIsLoading(true);
    
    // Simulate AI response - will be replaced with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock response based on query
    let response = '';
    const lowerQuery = trimmed.toLowerCase();
    
    if (lowerQuery.includes('position') || lowerQuery.includes('позиц')) {
      if (positions.length === 0) {
        response = locale === 'ru' 
          ? '📊 **Открытые позиции**\n\nУ вас нет открытых позиций.\n\n---\n*Не финсовет*'
          : '📊 **Open Positions**\n\nYou have no open positions.\n\n---\n*Not financial advice*';
      } else {
        const posLines = positions.map(p => 
          `• **${p.symbol}** ${p.side === 'Buy' ? '🟢 Long' : '🔴 Short'}: ${p.size} @ $${parseFloat(p.entryPrice).toLocaleString()} (P&L: $${parseFloat(p.unrealisedPnl).toFixed(2)})`
        ).join('\n');
        response = locale === 'ru'
          ? `📊 **Ваши открытые позиции**\n\n${posLines}\n\n---\n*Не финсовет*`
          : `📊 **Your Open Positions**\n\n${posLines}\n\n---\n*Not financial advice*`;
      }
    } else if (lowerQuery.includes('balance') || lowerQuery.includes('баланс')) {
      const totalEquity = balances.reduce((sum, b) => sum + parseFloat(b.equity || '0'), 0);
      const available = balances.reduce((sum, b) => sum + parseFloat(b.availableBalance || '0'), 0);
      response = locale === 'ru'
        ? `💰 **Баланс аккаунта**\n\n• Общий капитал: **$${totalEquity.toLocaleString()}**\n• Доступно: **$${available.toLocaleString()}**\n\n---\n*Не финсовет*`
        : `💰 **Account Balance**\n\n• Total Equity: **$${totalEquity.toLocaleString()}**\n• Available: **$${available.toLocaleString()}**\n\n---\n*Not financial advice*`;
    } else if (lowerQuery.includes('risk') || lowerQuery.includes('риск')) {
      response = locale === 'ru'
        ? `⚠️ **Оценка риска BTC**\n\n**Контекст:** Рынок находится в фазе консолидации после недавнего роста.\n\n**Рынок:** BTC торгуется около $42,500 с умеренной волатильностью. RSI(14) около 55 - нейтральная зона.\n\n**Риски:**\n• Ликвидность снижена в выходные\n• Потенциальная коррекция 5-10% возможна\n• Leverage выше 10x существенно повышает риск\n\n**Рекомендация:** Рассмотрите снижение позиции до 2% от портфеля при текущих условиях.\n\n---\n*Не финсовет - только информация для анализа*`
        : `⚠️ **BTC Risk Assessment**\n\n**Context:** Market is in consolidation phase after recent rally.\n\n**Market:** BTC trading around $42,500 with moderate volatility. RSI(14) at ~55 - neutral zone.\n\n**Risks:**\n• Reduced liquidity on weekends\n• Potential 5-10% correction possible\n• Leverage above 10x significantly increases risk\n\n**Suggestion:** Consider reducing position to 2% of portfolio under current conditions.\n\n---\n*Not financial advice - informational analysis only*`;
    } else if (lowerQuery.includes('plan') || lowerQuery.includes('план')) {
      response = locale === 'ru'
        ? `📈 **Торговый план ETH (Идея)**\n\n**Контекст:** ETH показывает силу относительно BTC.\n\n**Рынок:**\n• Цена: ~$2,280\n• Тренд: Восходящий на дневном ТФ\n• EMA20 > EMA50 - бычий сигнал\n\n**Идея входа:**\n• Вход: $2,250-2,300 (на откате)\n• Стоп: $2,150 (-4.4%)\n• Тейк: $2,500 (+9.7%)\n• R:R = 2.2:1\n\n**Риск:**\n• При балансе $10,000 и риске 1%: макс. потеря $100\n• Размер позиции: ~1 ETH\n\n**Что может пойти не так:**\n• BTC коррекция потянет ETH вниз\n• Слабость на общем рынке\n\n**Альтернативы:**\n• Подождать пробой $2,400 для подтверждения\n• Использовать DCA вместо единого входа\n\n---\n*Не финсовет - это только идея для анализа*`
        : `📈 **ETH Trading Plan (Idea)**\n\n**Context:** ETH showing strength relative to BTC.\n\n**Market:**\n• Price: ~$2,280\n• Trend: Uptrend on daily TF\n• EMA20 > EMA50 - bullish signal\n\n**Entry Idea:**\n• Entry: $2,250-2,300 (on pullback)\n• Stop: $2,150 (-4.4%)\n• Take: $2,500 (+9.7%)\n• R:R = 2.2:1\n\n**Risk:**\n• With $10,000 balance at 1% risk: max loss $100\n• Position size: ~1 ETH\n\n**What could go wrong:**\n• BTC correction could drag ETH down\n• General market weakness\n\n**Alternatives:**\n• Wait for $2,400 breakout confirmation\n• Use DCA instead of single entry\n\n---\n*Not financial advice - this is just an idea for analysis*`;
    } else {
      response = locale === 'ru'
        ? `Я ваш AI ассистент по портфелю. Я могу:\n\n• Показать ваши позиции и баланс\n• Оценить риски по конкретным активам\n• Предложить торговые идеи (не рекомендации!)\n• Проанализировать рыночные данные\n\nПопробуйте спросить: "Покажи мои позиции" или "Оцени риск BTC"\n\n---\n*Не финсовет*`
        : `I'm your AI portfolio assistant. I can:\n\n• Show your positions and balance\n• Assess risks for specific assets\n• Suggest trading ideas (not recommendations!)\n• Analyze market data\n\nTry asking: "Show my positions" or "Assess BTC risk"\n\n---\n*Not financial advice*`;
    }
    
    addMessage(currentConversationId, { role: 'assistant', content: response });
    setIsLoading(false);
  };
  
  const handleQuickCommand = (cmd: typeof quickCommands[0]) => {
    const text = locale === 'ru' ? cmd.ru : cmd.en;
    setInput(text);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground">
          {t('chat.title')}
        </h1>
        <div className="disclaimer">
          {t('chat.disclaimer')}
        </div>
      </div>
      
      {/* Quick commands */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs text-muted-foreground self-center mr-2">
          {t('chat.quickCommands')}:
        </span>
        {quickCommands.map((cmd) => (
          <Button
            key={cmd.key}
            variant="outline"
            size="xs"
            onClick={() => handleQuickCommand(cmd)}
          >
            {locale === 'ru' ? cmd.ru : cmd.en}
          </Button>
        ))}
      </div>
      
      {/* Messages area */}
      <Card variant="glass" className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {locale === 'ru' 
                  ? 'Начните диалог с AI ассистентом' 
                  : 'Start a conversation with the AI assistant'}
              </p>
              {!isConnected && (
                <div className="flex items-center gap-2 mt-4 text-warning text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    {locale === 'ru'
                      ? 'Подключите Bybit для получения данных'
                      : 'Connect Bybit to fetch real data'}
                  </span>
                </div>
              )}
            </div>
          )}
          
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted/30 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={t('chat.placeholder')}
              className="flex-1 bg-muted/30 border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isLoading}
            />
            <Button 
              variant="glow" 
              size="icon" 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex items-start gap-3",
      isUser && "flex-row-reverse"
    )}>
      <div className={cn(
        "p-2 rounded-full",
        isUser ? "bg-primary/20" : "bg-primary/10"
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-primary" />
        ) : (
          <Bot className="h-4 w-4 text-primary" />
        )}
      </div>
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-3",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted/30"
      )}>
        <div className={cn(
          "text-sm whitespace-pre-wrap",
          !isUser && "prose prose-sm prose-invert max-w-none"
        )}>
          {message.content.split('\n').map((line, i) => {
            // Simple markdown parsing
            const boldParsed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return (
              <p 
                key={i} 
                className={line.trim() === '' ? 'h-2' : 'mb-1'}
                dangerouslySetInnerHTML={{ __html: boldParsed }}
              />
            );
          })}
        </div>
        <div className="text-xs opacity-50 mt-2">
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
