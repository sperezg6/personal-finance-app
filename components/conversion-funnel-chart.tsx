'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/area-charts-2';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const chartData = [
  { date: '2024-04-01', visitors: 222, clicks: 150, signups: 120, purchases: 90 },
  { date: '2024-04-02', visitors: 97, clicks: 180, signups: 140, purchases: 100 },
  { date: '2024-04-03', visitors: 167, clicks: 120, signups: 95, purchases: 70 },
  { date: '2024-04-04', visitors: 242, clicks: 260, signups: 210, purchases: 160 },
  { date: '2024-04-05', visitors: 373, clicks: 290, signups: 240, purchases: 190 },
  { date: '2024-04-06', visitors: 301, clicks: 340, signups: 280, purchases: 220 },
  { date: '2024-04-07', visitors: 245, clicks: 180, signups: 150, purchases: 110 },
  { date: '2024-04-08', visitors: 409, clicks: 320, signups: 270, purchases: 210 },
  { date: '2024-04-09', visitors: 59, clicks: 110, signups: 90, purchases: 65 },
  { date: '2024-04-10', visitors: 261, clicks: 190, signups: 160, purchases: 120 },
  { date: '2024-04-11', visitors: 327, clicks: 350, signups: 300, purchases: 240 },
  { date: '2024-04-12', visitors: 292, clicks: 210, signups: 180, purchases: 140 },
  { date: '2024-04-13', visitors: 342, clicks: 380, signups: 320, purchases: 260 },
  { date: '2024-04-14', visitors: 137, clicks: 220, signups: 190, purchases: 150 },
  { date: '2024-04-15', visitors: 120, clicks: 170, signups: 140, purchases: 105 },
  { date: '2024-04-16', visitors: 138, clicks: 190, signups: 160, purchases: 125 },
  { date: '2024-04-17', visitors: 446, clicks: 360, signups: 310, purchases: 250 },
  { date: '2024-04-18', visitors: 364, clicks: 410, signups: 350, purchases: 285 },
  { date: '2024-04-19', visitors: 243, clicks: 180, signups: 150, purchases: 115 },
  { date: '2024-04-20', visitors: 89, clicks: 150, signups: 125, purchases: 95 },
  { date: '2024-04-21', visitors: 137, clicks: 200, signups: 170, purchases: 135 },
  { date: '2024-04-22', visitors: 224, clicks: 170, signups: 145, purchases: 110 },
  { date: '2024-04-23', visitors: 138, clicks: 230, signups: 195, purchases: 155 },
  { date: '2024-04-24', visitors: 387, clicks: 290, signups: 250, purchases: 200 },
  { date: '2024-04-25', visitors: 215, clicks: 250, signups: 215, purchases: 175 },
  { date: '2024-04-26', visitors: 75, clicks: 130, signups: 110, purchases: 85 },
  { date: '2024-04-27', visitors: 383, clicks: 420, signups: 360, purchases: 295 },
  { date: '2024-04-28', visitors: 122, clicks: 180, signups: 155, purchases: 120 },
  { date: '2024-04-29', visitors: 315, clicks: 240, signups: 205, purchases: 165 },
  { date: '2024-04-30', visitors: 454, clicks: 380, signups: 325, purchases: 265 },
  { date: '2024-05-01', visitors: 165, clicks: 220, signups: 190, purchases: 150 },
  { date: '2024-05-02', visitors: 293, clicks: 310, signups: 265, purchases: 215 },
  { date: '2024-05-03', visitors: 247, clicks: 190, signups: 165, purchases: 130 },
  { date: '2024-05-04', visitors: 385, clicks: 420, signups: 360, purchases: 295 },
  { date: '2024-05-05', visitors: 481, clicks: 390, signups: 335, purchases: 275 },
  { date: '2024-05-06', visitors: 498, clicks: 520, signups: 450, purchases: 370 },
  { date: '2024-05-07', visitors: 388, clicks: 300, signups: 260, purchases: 210 },
  { date: '2024-05-08', visitors: 149, clicks: 210, signups: 180, purchases: 145 },
  { date: '2024-05-09', visitors: 227, clicks: 180, signups: 155, purchases: 120 },
  { date: '2024-05-10', visitors: 293, clicks: 330, signups: 285, purchases: 230 },
  { date: '2024-05-11', visitors: 335, clicks: 270, signups: 235, purchases: 190 },
  { date: '2024-05-12', visitors: 197, clicks: 240, signups: 205, purchases: 165 },
  { date: '2024-05-13', visitors: 197, clicks: 160, signups: 140, purchases: 110 },
  { date: '2024-05-14', visitors: 448, clicks: 490, signups: 425, purchases: 350 },
  { date: '2024-05-15', visitors: 473, clicks: 380, signups: 330, purchases: 270 },
  { date: '2024-05-16', visitors: 338, clicks: 400, signups: 345, purchases: 285 },
  { date: '2024-05-17', visitors: 499, clicks: 420, signups: 365, purchases: 300 },
  { date: '2024-05-18', visitors: 315, clicks: 350, signups: 305, purchases: 250 },
  { date: '2024-05-19', visitors: 235, clicks: 180, signups: 155, purchases: 125 },
  { date: '2024-05-20', visitors: 177, clicks: 230, signups: 200, purchases: 160 },
  { date: '2024-05-21', visitors: 82, clicks: 140, signups: 120, purchases: 95 },
  { date: '2024-05-22', visitors: 81, clicks: 120, signups: 105, purchases: 80 },
  { date: '2024-05-23', visitors: 252, clicks: 290, signups: 250, purchases: 205 },
  { date: '2024-05-24', visitors: 294, clicks: 220, signups: 190, purchases: 155 },
  { date: '2024-05-25', visitors: 201, clicks: 250, signups: 215, purchases: 175 },
  { date: '2024-05-26', visitors: 213, clicks: 170, signups: 145, purchases: 115 },
  { date: '2024-05-27', visitors: 420, clicks: 460, signups: 400, purchases: 330 },
  { date: '2024-05-28', visitors: 233, clicks: 190, signups: 165, purchases: 135 },
  { date: '2024-05-29', visitors: 78, clicks: 130, signups: 115, purchases: 90 },
  { date: '2024-05-30', visitors: 340, clicks: 280, signups: 245, purchases: 200 },
  { date: '2024-05-31', visitors: 178, clicks: 230, signups: 200, purchases: 165 },
  { date: '2024-06-01', visitors: 178, clicks: 200, signups: 175, purchases: 140 },
  { date: '2024-06-02', visitors: 470, clicks: 410, signups: 355, purchases: 290 },
  { date: '2024-06-03', visitors: 103, clicks: 160, signups: 140, purchases: 110 },
  { date: '2024-06-04', visitors: 439, clicks: 380, signups: 330, purchases: 270 },
  { date: '2024-06-05', visitors: 88, clicks: 140, signups: 120, purchases: 95 },
  { date: '2024-06-06', visitors: 294, clicks: 250, signups: 215, purchases: 175 },
  { date: '2024-06-07', visitors: 323, clicks: 370, signups: 320, purchases: 265 },
  { date: '2024-06-08', visitors: 385, clicks: 320, signups: 280, purchases: 230 },
  { date: '2024-06-09', visitors: 438, clicks: 480, signups: 415, purchases: 340 },
  { date: '2024-06-10', visitors: 155, clicks: 200, signups: 175, purchases: 140 },
  { date: '2024-06-11', visitors: 92, clicks: 150, signups: 130, purchases: 105 },
  { date: '2024-06-12', visitors: 492, clicks: 420, signups: 365, purchases: 300 },
  { date: '2024-06-13', visitors: 81, clicks: 130, signups: 115, purchases: 90 },
  { date: '2024-06-14', visitors: 426, clicks: 380, signups: 330, purchases: 270 },
  { date: '2024-06-15', visitors: 307, clicks: 350, signups: 305, purchases: 250 },
  { date: '2024-06-16', visitors: 371, clicks: 310, signups: 270, purchases: 220 },
  { date: '2024-06-17', visitors: 475, clicks: 520, signups: 455, purchases: 375 },
  { date: '2024-06-18', visitors: 107, clicks: 170, signups: 150, purchases: 120 },
  { date: '2024-06-19', visitors: 341, clicks: 290, signups: 250, purchases: 205 },
  { date: '2024-06-20', visitors: 408, clicks: 450, signups: 390, purchases: 320 },
  { date: '2024-06-21', visitors: 169, clicks: 210, signups: 185, purchases: 150 },
  { date: '2024-06-22', visitors: 317, clicks: 270, signups: 235, purchases: 190 },
  { date: '2024-06-23', visitors: 480, clicks: 530, signups: 465, purchases: 385 },
  { date: '2024-06-24', visitors: 132, clicks: 180, signups: 155, purchases: 125 },
  { date: '2024-06-25', visitors: 141, clicks: 190, signups: 165, purchases: 135 },
  { date: '2024-06-26', visitors: 434, clicks: 380, signups: 330, purchases: 270 },
  { date: '2024-06-27', visitors: 448, clicks: 490, signups: 425, purchases: 350 },
  { date: '2024-06-28', visitors: 149, clicks: 200, signups: 175, purchases: 140 },
  { date: '2024-06-29', visitors: 103, clicks: 160, signups: 140, purchases: 110 },
  { date: '2024-06-30', visitors: 446, clicks: 400, signups: 345, purchases: 285 },
];

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'rgb(16 185 129)', // esmerald-500
  },
  clicks: {
    label: 'Clicks',
    color: 'rgb(239 68 68)', // red-500
  },
  signups: {
    label: 'Sign-ups',
    color: 'rgb(59 130 246)', // blue-500
  },
} satisfies ChartConfig;

export function ConversionFunnelChart() {
  const [timeRange, setTimeRange] = React.useState('90d');

  const filteredData = React.useMemo(() => {
    // Get the last date in the dataset
    const lastDate = new Date(chartData[chartData.length - 1].date);

    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }

    const startDate = new Date(lastDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return chartData.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  }, [timeRange]);

  // Calculate totals for metrics
  const totals = filteredData.reduce(
    (acc, item) => ({
      visitors: acc.visitors + item.visitors,
      clicks: acc.clicks + item.clicks,
      signups: acc.signups + item.signups,
      purchases: acc.purchases + item.purchases,
    }),
    { visitors: 0, clicks: 0, signups: 0, purchases: 0 }
  );

  return (
    <Card className="w-full transition-all hover:shadow-lg">
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Spending Tracker</h2>
            <p className="text-sm text-muted-foreground">
              Track user journey from visitors to purchases
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a time range"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Chart */}
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <pattern
                id="grid-pattern"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" fill="hsl(var(--muted-foreground))" opacity="0.1" />
              </pattern>
              <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-visitors)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-visitors)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-clicks)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-clicks)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSignups" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-signups)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-signups)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPurchases" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-purchases)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-purchases)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="url(#grid-pattern)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="visitors"
              type="natural"
              fill="url(#fillVisitors)"
              stroke="var(--color-visitors)"
              stackId="a"
            />
            <Area
              dataKey="clicks"
              type="natural"
              fill="url(#fillClicks)"
              stroke="var(--color-clicks)"
              stackId="a"
            />
            <Area
              dataKey="signups"
              type="natural"
              fill="url(#fillSignups)"
              stroke="var(--color-signups)"
              stackId="a"
            />
            <Area
              dataKey="purchases"
              type="natural"
              fill="url(#fillPurchases)"
              stroke="var(--color-purchases)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-indigo-700" />
            <span>Visitors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
            <span>Clicks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
            <span>Sign-ups</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-indigo-400" />
            <span>Purchases</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
