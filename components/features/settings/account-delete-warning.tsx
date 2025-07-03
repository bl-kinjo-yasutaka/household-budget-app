/**
 * アカウント削除の警告セクション
 *
 * @description
 * アカウント削除の重要性とリスクを明確に表示する
 * 視覚的に目立つデザインでユーザーの注意を喚起する
 */
export function AccountDeleteWarning() {
  return (
    <div className="rounded-lg bg-destructive/10 p-4">
      <h4 className="text-sm font-medium text-destructive mb-2">⚠️ 重要な注意事項</h4>
      <ul className="text-sm text-muted-foreground space-y-1">
        <li>• アカウントを削除すると、すべてのデータが完全に削除されます</li>
        <li>• 取引履歴、カテゴリ、設定などすべての情報が失われます</li>
        <li>• この操作は取り消すことができません</li>
      </ul>
    </div>
  );
}
