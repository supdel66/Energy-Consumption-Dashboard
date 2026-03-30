'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingDown, TrendingUp } from "lucide-react";

const monthlyData = [
    { month: "Jul", consumption: 98, cost: 8470, savings: 450 },
    { month: "Aug", consumption: 102, cost: 8820, savings: 380 },
    { month: "Sep", consumption: 95, cost: 8218, savings: 580 },
    { month: "Oct", consumption: 89, cost: 7699, savings: 720 },
    { month: "Nov", consumption: 92, cost: 7958, savings: 640 },
    { month: "Dec", consumption: 87, cost: 7526, savings: 780 },
    { month: "Jan", consumption: 84, cost: 7266, savings: 920 },
];

const chartConfig = {
    consumption: {
        label: "Consumption (kWh)",
        color: "#3b82f6",
    },
};

export default function MonthlyComparisonChart() {
    const currentMonth = monthlyData[monthlyData.length - 1];
    const previousMonth = monthlyData[monthlyData.length - 2];
    const percentageChange = ((currentMonth.consumption - previousMonth.consumption) / previousMonth.consumption * 100).toFixed(1);
    const isDecrease = parseFloat(percentageChange) < 0;

    return (
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-white">Monthly Comparison</CardTitle>
                        <CardDescription className="text-white/60">
                            Last 7 months energy consumption
                        </CardDescription>
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                        isDecrease ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                        {isDecrease ? (
                            <TrendingDown className="w-4 h-4" />
                        ) : (
                            <TrendingUp className="w-4 h-4" />
                        )}
                        <span className="text-sm font-semibold">
                            {Math.abs(parseFloat(percentageChange))}%
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={monthlyData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            stroke="rgba(255,255,255,0.6)"
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={5}
                            stroke="rgba(255,255,255,0.6)"
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey="consumption"
                            fill="url(#barGradient)"
                            radius={[8, 8, 0, 0]}
                        />
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ChartContainer>

                {/* Monthly Summary */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div>
                        <div className="text-xs text-white/60 mb-1">This Month</div>
                        <div className="text-lg font-bold text-white">{currentMonth.consumption} kWh</div>
                    </div>
                    <div>
                        <div className="text-xs text-white/60 mb-1">Cost</div>
                        <div className="text-lg font-bold text-white">Rs. {currentMonth.cost.toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-xs text-white/60 mb-1">Saved</div>
                        <div className="text-lg font-bold text-green-400">Rs. {currentMonth.savings}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
