
import { MonthlySpending } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MonthlyBarChartProps {
  data: MonthlySpending[];
  isLoading: boolean;
}

const MonthlyBarChart = ({ data, isLoading }: MonthlyBarChartProps) => {
  if (isLoading) {
    return (
      <div className="expense-card h-80 animate-pulse flex flex-col gap-4">
        <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
        <div className="flex-1 bg-gray-100 rounded"></div>
      </div>
    );
  }

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="expense-card h-80 flex flex-col">
        <h3 className="text-lg font-medium mb-4">Monthly Spending</h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-card h-80 flex flex-col">
      <h3 className="text-lg font-medium mb-4">Monthly Spending</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
              width={60}
            />
            <Tooltip 
              formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
              labelStyle={{color: '#1F2937'}}
              itemStyle={{color: '#1F2937'}}
            />
            <Bar 
              dataKey="amount" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyBarChart;
