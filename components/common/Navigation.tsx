'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/src/contexts/auth-context';
import { Button } from '@/components/ui/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/Sheet';
import { Menu, Home, Plus, BarChart3, Settings, LogOut, User, Tag } from 'lucide-react';

const Navigation = () => {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'ホーム', icon: Home, testId: 'nav-dashboard' },
    { href: '/transactions/new', label: '収支入力', icon: Plus },
    { href: '/transactions', label: '取引履歴', icon: BarChart3, testId: 'nav-transactions' },
    { href: '/categories', label: 'カテゴリ管理', icon: Tag, testId: 'nav-categories' },
    { href: '/settings', label: '設定', icon: Settings, testId: 'nav-settings' },
  ];

  const NavLink = ({
    href,
    label,
    icon: Icon,
    mobile = false,
    testId,
  }: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    mobile?: boolean;
    testId?: string;
  }) => {
    const isActive = pathname === href;

    if (mobile) {
      return (
        <Link
          href={href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
          data-testid={testId}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      );
    }

    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'text-primary bg-primary/10'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        }`}
        data-testid={testId}
      >
        <Icon className="h-4 w-4" />
        <span className="hidden md:inline">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              ホ
            </div>
            <span className="hidden font-bold sm:inline-block">家計簿アプリ</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* User Profile Display */}
            <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {user?.name || 'ユーザー'}
                </span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="hidden sm:inline-flex text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline ml-2">ログアウト</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">メニューを開く</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <SheetHeader>
                  <SheetTitle className="text-left">家計簿アプリ</SheetTitle>
                </SheetHeader>
                <div className="grid gap-2 py-4">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} mobile />
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{user?.name || user?.email}</span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="w-full justify-start gap-3 px-3 text-destructive hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      ログアウト
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
