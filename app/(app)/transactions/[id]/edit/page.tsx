import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default async function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/transactions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">取引を編集</h1>
          <p className="text-muted-foreground">取引ID: {id}</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">取引情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <div className="mb-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Save className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">取引編集フォーム</h3>
            <p className="mb-4">取引編集フォームは準備中です</p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/transactions">キャンセル</Link>
              </Button>
              <Button disabled>
                <Save className="h-4 w-4" />
                保存
              </Button>
              <Button variant="destructive" disabled>
                <Trash2 className="h-4 w-4" />
                削除
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
