'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface PredictionLogEntry {
    timestamp: string;
    true_kwh: number | null;
    predicted_kwh: number | null;
    error: number | null;
}

interface Props {
    data: PredictionLogEntry[];
}

const chartConfig = {
    true_kwh: {
        label: "True (kWh)",
        color: "hsl(var(--chart-1))",
    },
    predicted_kwh: {
        label: "Predicted (kWh)",
        color: "hsl(var(--chart-2))",
    },
};

export default function WeeklyConsumptionChart({ data }: Props) {
    // Format timestamp to short time (e.g., 10:00)
    const formattedData = data.slice(-20).map(d => ({
        ...d,
        time: d.timestamp.split(' ')[1]?.substring(0, 5) || d.timestamp
    }));

    return (
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white">
            <CardHeader>
                <CardTitle className="text-white">Recent Consumption Log</CardTitle>
                <CardDescription className="text-white/60">
                    True vs Predicted Energy Usage
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={formattedData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="time"
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
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                            dataKey="true_kwh"
                            type="monotone"
                            fill="url(#fillTrue)"
                            fillOpacity={0.4}
                            stroke="#22d3ee" // Cyan
                            strokeWidth={2}
                        />
                        <Area
                            dataKey="predicted_kwh"
                            type="monotone"
                            fill="url(#fillPredicted)"
                            fillOpacity={0.4}
                            stroke="#a78bfa" // Purple
                            strokeWidth={2}
                        />
                        <defs>
                            <linearGradient id="fillTrue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillPredicted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
