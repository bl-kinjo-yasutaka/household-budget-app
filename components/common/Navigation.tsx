'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/src/contexts/auth-context';

const Navigation = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = [
    { href: '/', label: 'ホーム', icon: '🏠' },
    { href: '/transactions/new', label: '収支入力', icon: '➕' },
    { href: '/transactions', label: '履歴', icon: '📊' },
    { href: '/settings', label: '設定', icon: '⚙️' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">家計簿アプリ</h1>
          </div>
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === item.href
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
              {user && <span className="text-sm text-gray-600">{user.name || user.email}</span>}
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <span className="mr-1">🚪</span>
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
