'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CircleDollarSign, TrendingUp, UserPlus } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

// Default data for when no real data is available
const defaultData = Array.from({ length: 15 }, () => ({ value: Math.random() * 5000 + 1000 }));

interface AreaChartsProps {
  income?: number;
  savings?: number;
  spending?: number;
  incomeData?: Array<{ value: number }>;
  savingsData?: Array<{ value: number }>;
  spendingData?: Array<{ value: number }>;
}

export default function AreaCharts({
  income = 6238,
  savings = 6202,
  spending = 18945,
  incomeData = defaultData,
  savingsData = defaultData,
  spendingData = defaultData,
}: AreaChartsProps) {
  // Business cards configuration
  const businessCards = [
    {
      title: 'Income',
      period: 'Last 28 days',
      value: `$${income.toLocaleString()}`,
      timestamp: '',
      data: incomeData,
      color: 'rgb(16 185 129)', // emerald-500
      icon: CircleDollarSign,
      gradientId: 'revenueGradient',
    },
    {
      title: 'Savings',
      period: 'Last 28 days',
      value: `$${savings.toLocaleString()}`,
      timestamp: '3h ago',
      data: savingsData,
      color: 'rgb(59 130 246)', // blue-500
      icon: UserPlus,
      gradientId: 'customersGradient',
    },
    {
      title: 'Spending',
      period: 'Last 28 days',
      value: `$${spending.toLocaleString()}`,
      timestamp: '1h ago',
      data: spendingData,
      color: 'rgb(239 68 68)', // red 500
      icon: TrendingUp,
      gradientId: 'usersGradient',
    },
  ];
  return (
    <div className="w-full">
      <div className="@container w-full">
        {/* Grid of 3 cards */}
        <div className="grid grid-cols-1 @3xl:grid-cols-3 gap-6">
          {businessCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Card key={i} className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="space-y-5">
                  {/* Header with icon and title */}
                  <div className="flex items-center gap-2">
                    <Icon className="size-5" style={{ color: card.color }} />
                    <span className="text-base font-semibold">{card.title}</span>
                  </div>

                  <div className="flex items-end gap-2.5 justify-between">
                    {/* Details */}
                    <div className="flex flex-col gap-1">
                      {/* Period */}
                      <div className="text-sm text-muted-foreground whitespace-nowrap">{card.period}</div>

                      {/* Value */}
                      <div className="text-3xl font-bold text-foreground tracking-tight font-mono">{card.value}</div>
                    </div>

                    {/* Chart */}
                    <div className="max-w-40 h-16 w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={card.data}
                          margin={{
                            top: 5,
                            right: 5,
                            left: 5,
                            bottom: 5,
                          }}
                        >
                          <defs>
                            <linearGradient id={card.gradientId} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={card.color} stopOpacity={0.3} />
                              <stop offset="100%" stopColor={card.color} stopOpacity={0.05} />
                            </linearGradient>
                            <filter id={`dotShadow${i}`} x="-50%" y="-50%" width="200%" height="200%">
                              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
                            </filter>
                          </defs>

                          <Tooltip
                            cursor={{ stroke: card.color, strokeWidth: 1, strokeDasharray: '2 2' }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const value = payload[0].value as number;
                                const formatValue = (val: number) => {
                                  if (card.title === 'Revenue') {
                                    return `$${(val / 1000).toFixed(1)}k`;
                                  } else if (card.title === 'New Customers') {
                                    return `${(val / 1000).toFixed(1)}k`;
                                  } else {
                                    return `${(val / 1000).toFixed(1)}k`;
                                  }
                                };

                                return (
                                  <div className="bg-background/95 backdrop-blur-sm border border-border shadow-lg rounded-lg p-2 pointer-events-none">
                                    <p className="text-sm font-semibold text-foreground">{formatValue(value)}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />

                          {/* Area with gradient and enhanced shadow */}
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={card.color}
                            fill={`url(#${card.gradientId})`}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{
                              r: 6,
                              fill: card.color,
                              stroke: 'white',
                              strokeWidth: 2,
                              filter: `url(#dotShadow${i})`,
                            }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
