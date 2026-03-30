'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface Prediction {
    timestamp: string;
    predicted_kwh: number;
}

interface Props {
    data: Prediction[];
}

const chartConfig = {
    predicted_kwh: {
        label: "Predicted (kWh)",
        color: "hsl(var(--chart-2))", // Purple-ish
    },
};

export default function WeeklyEnergyForecast({ data }: Props) {
    if (!data || data.length === 0) return null;

    // Aggregate by day (Date string without time)
    const dailyData: Record<string, number> = {};
    
    data.forEach(d => {
        // timestamp format usually "YYYY-MM-DD HH:MM:SS"
        const datePart = d.timestamp.split(' ')[0];
        if (datePart) {
            // Get short day name (e.g., Mon, Tue)
            // To ensure correct sorting if crossing month/year, we might just use datePart
            // but for display, we want Day Name. Let's group by datePart first.
            if (!dailyData[datePart]) {
                dailyData[datePart] = 0;
            }
            dailyData[datePart] += d.predicted_kwh;
        }
    });

    const formattedData = Object.keys(dailyData)
        .sort() // chronological order
        .map(datePart => {
            const dateObj = new Date(datePart);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            return {
                day: dayName,
                predicted_kwh: Number(dailyData[datePart].toFixed(2)),
            };
        });

    return (
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white">
            <CardHeader>
                <CardTitle className="text-white">7-Day Energy Forecast</CardTitle>
                <CardDescription className="text-white/60">
                    Predicted daily consumption for the next week
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
                        }}
                    >
                        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            tickMargin={8}
                            axisLine={false}
                            stroke="rgba(255,255,255,0.6)"
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            stroke="rgba(255,255,255,0.6)"
                            tickFormatter={(value) => `${value}`}
                        />
                        <ChartTooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            content={<ChartTooltipContent />}
                        />
                        <Bar 
                            dataKey="predicted_kwh" 
                            fill="#a78bfa" 
                            radius={[4, 4, 0, 0]} 
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
