
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrainingMetrics {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

interface AIMetricsChartProps {
  initialData?: TrainingMetrics[];
  latestMetrics?: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
}

const defaultTrainingData: TrainingMetrics[] = [
  {
    name: 'Baseline',
    accuracy: 0.72,
    precision: 0.68,
    recall: 0.65,
    f1Score: 0.66,
  },
  {
    name: 'Training 1',
    accuracy: 0.78,
    precision: 0.75,
    recall: 0.70,
    f1Score: 0.72,
  },
  {
    name: 'Training 2',
    accuracy: 0.83,
    precision: 0.80,
    recall: 0.76,
    f1Score: 0.78,
  },
  {
    name: 'Training 3',
    accuracy: 0.85,
    precision: 0.82,
    recall: 0.79,
    f1Score: 0.80,
  },
  {
    name: 'Training 4',
    accuracy: 0.87,
    precision: 0.84,
    recall: 0.81,
    f1Score: 0.82,
  },
];

const AIMetricsChart = ({ initialData, latestMetrics }: AIMetricsChartProps) => {
  const [chartData, setChartData] = useState<TrainingMetrics[]>(initialData || defaultTrainingData);

  useEffect(() => {
    // If we have new metrics, add them to the chart
    if (latestMetrics) {
      setChartData(prevData => {
        const newTraining = {
          name: `Training ${prevData.length}`,
          ...latestMetrics
        };
        return [...prevData, newTraining];
      });
    }
  }, [latestMetrics]);

  // Load saved chart data from localStorage if available
  useEffect(() => {
    const savedData = localStorage.getItem('aiTrainingMetrics');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setChartData(parsedData);
      } catch (error) {
        console.error('Failed to parse saved metrics:', error);
      }
    }
  }, []);

  // Save chart data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('aiTrainingMetrics', JSON.stringify(chartData));
  }, [chartData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0.5, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
        <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`} />
        <Legend />
        <Line type="monotone" dataKey="accuracy" stroke="#8884d8" activeDot={{ r: 8 }} name="Accuracy" />
        <Line type="monotone" dataKey="precision" stroke="#82ca9d" name="Precision" />
        <Line type="monotone" dataKey="recall" stroke="#ffc658" name="Recall" />
        <Line type="monotone" dataKey="f1Score" stroke="#ff8042" name="F1 Score" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AIMetricsChart;
