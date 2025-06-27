import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Tag } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">カテゴリ管理</h1>
          <p className="text-muted-foreground">収支の分類を管理</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          新しいカテゴリ
        </Button>
      </div>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">カテゴリ一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <div className="mb-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Tag className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">カテゴリ管理</h3>
            <p className="mb-4">カテゴリ管理機能は準備中です</p>
            <Button>カテゴリを追加</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
