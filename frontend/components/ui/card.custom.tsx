import * as React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return <div className={cn('card', className)} {...props} />
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn('mb-3', className)} {...props} />
}

export function CardTitle({ className, ...props }: CardProps) {
  return <h3 className={cn('text-sm uppercase text-muted', className)} {...props} />
}
