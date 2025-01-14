import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for the bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data, title }) => {
  // Define the options for the bar chart, including the display of the title and legend position
  const options = {
    responsive: true, // Make the chart responsive to window resizing
    plugins: {
      legend: {
        position: 'top', // Position the legend at the top of the chart
      },
      title: {
        display: true, // Display the title
        text: title, // Set the title text from the props
      },
    },
  };

  // Define custom colours for the bars in the chart
  const customColors = {
    backgroundColor: 'rgba(255, 127, 80, 0.2)', // Light orange for the bar background
    borderColor: 'rgba(255, 127, 80, 1)', // Darker orange for the bar borders
  };

  // Apply the custom colours to each dataset in the data
  const customizedData = {
    ...data, // Keep other properties of the data unchanged
    datasets: data.datasets.map(dataset => ({
      ...dataset, // Copy all properties of the dataset
      backgroundColor: customColors.backgroundColor, // Apply the custom background colour
      borderColor: customColors.borderColor, // Apply the custom border colour
    })),
  };

  // Render the bar chart with the customised data and options
  return <Bar data={customizedData} options={options} />;
};

export default BarChart;
