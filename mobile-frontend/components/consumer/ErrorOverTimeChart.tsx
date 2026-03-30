'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
    error: {
        label: "Abs Error (kWh)",
    },
};

export default function ErrorOverTimeChart({ data }: Props) {
    if (!data || data.length === 0) return null;

    const formattedData = data.slice(-20).map(d => {
        let errValue = d.error || 0;
        let fill = "#f87171"; // red
        if (errValue < 0.01) fill = "#4ade80"; // green
        else if (errValue < 0.05) fill = "#fbbf24"; // yellow
        
        return {
            time: d.timestamp.split(' ')[1]?.substring(0, 5) || d.timestamp,
            error: errValue,
            fill: fill
        };
    });

    return (
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white">
            <CardHeader>
                <CardTitle className="text-white">Prediction Error Over Time</CardTitle>
                <CardDescription className="text-white/60">
                    Absolute Error in kWh
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={formattedData}
                        margin={{
                            left: 12,
                            right: 12,
                            top: 10,
                            bottom: 10
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
                            cursor={{fill: "rgba(255,255,255,0.05)"}}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        {/* We use Bar with dynamic fill but recharts cell fill is easier mapped by providing 'fill' key in data if we are not injecting <Cell> elements inside <Bar>. Yes, mapping `fill` in the data array is native to Recharts. */}
                        <Bar
                            dataKey="error"
                            radius={4}
                            barSize={30}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
