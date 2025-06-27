import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewTransactionPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/transactions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">収支入力</h1>
          <p className="text-muted-foreground">新しい取引を記録します</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">取引情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Save className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">取引フォーム</h3>
            <p className="text-muted-foreground mb-4">収支入力フォームは準備中です</p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/transactions">キャンセル</Link>
              </Button>
              <Button disabled>保存</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
