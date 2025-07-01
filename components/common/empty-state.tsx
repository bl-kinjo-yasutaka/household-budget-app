'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  showBackButton?: boolean;
  backHref?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  showBackButton = false,
  backHref = '/transactions',
}: EmptyStateProps) {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {showBackButton && (
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          {title && (
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            </div>
          )}
        </div>
      )}
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">{description}</p>
          <Button variant="outline" asChild className="mt-4">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
