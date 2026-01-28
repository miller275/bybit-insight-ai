import * as React from "react";

import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glow';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border text-card-foreground transition-all duration-200",
        variant === 'default' && "bg-card shadow-sm",
        variant === 'glass' && "bg-card/50 backdrop-blur-sm border-border/50",
        variant === 'glow' && "bg-card shadow-lg glow-primary border-primary/20",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1 p-4", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-sm font-medium leading-none tracking-tight text-muted-foreground", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-4 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

// Trading-specific card for metrics
const MetricCard = React.forwardRef<HTMLDivElement, CardProps & { 
  label: string; 
  value: string | number; 
  change?: number;
  prefix?: string;
}>(
  ({ className, label, value, change, prefix = '', ...props }, ref) => (
    <Card ref={ref} variant="glass" className={cn("p-4", className)} {...props}>
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-xl font-semibold font-mono tabular-nums">
        {prefix}{value}
      </div>
      {change !== undefined && (
        <div className={cn(
          "text-xs font-mono mt-1",
          change >= 0 ? "text-profit" : "text-loss"
        )}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </div>
      )}
    </Card>
  )
);
MetricCard.displayName = "MetricCard";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, MetricCard };
