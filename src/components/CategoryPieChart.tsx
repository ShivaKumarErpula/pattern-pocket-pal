
import { CategoryTotal } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface CategoryPieChartProps {
  data: CategoryTotal[];
  isLoading: boolean;
}

const CategoryPieChart = ({ data, isLoading }: CategoryPieChartProps) => {
  if (isLoading) {
    return (
      <div className="expense-card h-80 animate-pulse flex flex-col gap-4">
        <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="rounded-full h-40 w-40 bg-gray-200"></div>
        </div>
      </div>
    );
  }

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="expense-card h-80 flex flex-col">
        <h3 className="text-lg font-medium mb-4">Spending by Category</h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }
  
  // Format data for the chart
  const chartData = data.map(item => ({
    name: item.category,
    value: item.amount,
    color: item.color,
    percentage: item.percentage
  }));
  
  return (
    <div className="expense-card h-80 flex flex-col">
      <h3 className="text-lg font-medium mb-4">Spending by Category</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} 
              itemStyle={{color: '#1F2937'}}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryPieChart;
