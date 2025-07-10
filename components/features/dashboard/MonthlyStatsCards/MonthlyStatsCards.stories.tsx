import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

// Storybook用のStatCardコンポーネント
interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  valueColor?: string;
}

function StatCard({
  title,
  value,
  description,
  icon,
  valueColor = 'text-foreground',
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// Storybook用のMonthlyStatsCardsコンポーネント
interface MonthlyStatsCardsProps {
  income: number;
  expense: number;
  incomeCount: number;
  expenseCount: number;
  formatCurrency: (amount: number) => string;
}

function MonthlyStatsCardsComponent({
  income,
  expense,
  incomeCount,
  expenseCount,
  formatCurrency,
}: MonthlyStatsCardsProps) {
  const balance = income - expense;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="今月の収入"
        value={formatCurrency(income)}
        description={`${incomeCount} 件の収入`}
        icon={<TrendingUp className="h-4 w-4 text-primary" />}
        valueColor="text-primary"
      />

      <StatCard
        title="今月の支出"
        value={formatCurrency(expense)}
        description={`${expenseCount} 件の支出`}
        icon={<TrendingDown className="h-4 w-4 text-destructive" />}
        valueColor="text-destructive"
      />

      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">今月の残高</CardTitle>
          <Wallet className="h-4 w-4 text-chart-2" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${balance >= 0 ? 'text-chart-2' : 'text-destructive'}`}
          >
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-muted-foreground">{balance >= 0 ? '黒字' : '赤字'}です</p>
        </CardContent>
      </Card>
    </div>
  );
}

const meta: Meta<typeof MonthlyStatsCardsComponent> = {
  title: 'Features/Dashboard/MonthlyStatsCards',
  component: MonthlyStatsCardsComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    income: { control: 'number' },
    expense: { control: 'number' },
    incomeCount: { control: 'number' },
    expenseCount: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const formatCurrency = (amount: number) => `¥${amount.toLocaleString()}`;

export const Default: Story = {
  args: {
    income: 150000,
    expense: 80000,
    incomeCount: 3,
    expenseCount: 12,
    formatCurrency,
  },
};

export const Deficit: Story = {
  args: {
    income: 80000,
    expense: 120000,
    incomeCount: 2,
    expenseCount: 18,
    formatCurrency,
  },
};

export const NoTransactions: Story = {
  args: {
    income: 0,
    expense: 0,
    incomeCount: 0,
    expenseCount: 0,
    formatCurrency,
  },
};

export const HighActivity: Story = {
  args: {
    income: 350000,
    expense: 280000,
    incomeCount: 8,
    expenseCount: 45,
    formatCurrency,
  },
};

export const OnlyIncome: Story = {
  args: {
    income: 200000,
    expense: 0,
    incomeCount: 4,
    expenseCount: 0,
    formatCurrency,
  },
};

export const OnlyExpense: Story = {
  args: {
    income: 0,
    expense: 95000,
    incomeCount: 0,
    expenseCount: 25,
    formatCurrency,
  },
};
