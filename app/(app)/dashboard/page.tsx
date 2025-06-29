export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-sm text-gray-600 mb-2">今月の収入</h2>
          <p className="text-2xl font-bold text-green-600">¥0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-sm text-gray-600 mb-2">今月の支出</h2>
          <p className="text-2xl font-bold text-red-600">¥0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-sm text-gray-600 mb-2">残高</h2>
          <p className="text-2xl font-bold">¥0</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">最近の取引</h2>
        <p className="text-gray-500">取引データがありません</p>
      </div>
    </div>
  );
}
