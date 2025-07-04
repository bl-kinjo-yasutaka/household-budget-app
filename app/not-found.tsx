import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-6">
        <Card className="max-w-md mx-auto">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Home className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
              <h2 className="text-lg font-medium text-foreground mb-2">ページが見つかりません</h2>
              <p className="text-muted-foreground mb-4">
                お探しのページは存在しないか、移動または削除された可能性があります。
              </p>
              <Button asChild>
                <Link href="/">
                  <Home className="h-4 w-4" />
                  ホームに戻る
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
