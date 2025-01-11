import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data, title }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  const customColors = {
    backgroundColor: 'rgba(255, 127, 80, 0.2)', 
    borderColor: 'rgba(255, 127, 80, 1)', 
  };

  const customizedData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: customColors.backgroundColor,
      borderColor: customColors.borderColor,
    })),
  };

  return <Bar data={customizedData} options={options} />;
};

export default BarChart;
