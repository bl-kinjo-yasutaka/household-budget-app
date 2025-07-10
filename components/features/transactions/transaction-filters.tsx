'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import type { Category } from '@/src/api/generated/model';

interface TransactionFiltersProps {
  fromDate: string;
  toDate: string;
  categoryId: string;
  searchTerm: string;
  categories: Category[];
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSearchTermChange: (value: string) => void;
  onClearFilters: () => void;
}

export function TransactionFilters({
  fromDate,
  toDate,
  categoryId,
  searchTerm,
  categories,
  onFromDateChange,
  onToDateChange,
  onCategoryChange,
  onSearchTermChange,
  onClearFilters,
}: TransactionFiltersProps) {
  const hasActiveFilters = fromDate || toDate || (categoryId && categoryId !== 'all') || searchTerm;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">フィルター・検索</CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              フィルターをクリア
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">メモ検索</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="取引メモで検索..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">開始日</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => onFromDateChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">終了日</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={toDate}
                onChange={(e) => onToDateChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">カテゴリ</label>
            <Select value={categoryId} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id?.toString() ?? ''}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: category.colorHex }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
