import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, BarController, BarElement } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, BarController, BarElement);

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Doanh thu',
        data: [],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  });

  const [selectedDays, setSelectedDays] = useState(14);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/statistic/get-revenue-by-day/${selectedDays}`);
        const result = await response.json();
        const data = result.data;

        if (Array.isArray(data)) {
          // Tạo một mảng labels với tất cả các tháng trong khoảng thời gian đã chọn
          const allLabels = Array.from({ length: selectedDays }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - selectedDays + i + 1);
            return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`; // Trả về tháng dưới dạng 'YYYY-MM'
          });

          // Tạo một mảng data với doanh thu tương ứng với mỗi tháng
          const allData = allLabels.map(label => {
            const item = data.find(item => item.time === label);
            return item ? item.revenue : 0; // Nếu không có doanh thu cho tháng đó, trả về 0
          });

          setChartData({
            labels: allLabels,
            datasets: [
              {
                label: 'Doanh thu',
                data: allData,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.log('Dữ liệu không phải là một mảng');
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    };

    fetchData();
  }, [selectedDays]);

  const handleSelectChange = (event) => {
    setSelectedDays(event.target.value);
  };

  return (
    <div>
      <h2>Doanh thu</h2>
      <select value={selectedDays} onChange={handleSelectChange}>
        <option value="7">7 ngày gần đây</option>
        <option value="14">14 ngày gần đây</option>
        <option value="6">6 tháng gần nhất</option>
        <option value="12">1 năm gần đây</option>
      </select>
      <Bar
        data={chartData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: Math.max(...chartData.datasets[0].data) * 1.1, // Tính toán giá trị tối đa dựa trên dữ liệu hiện tại
            },
            x: {
              type: 'category',
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y;
                  return `Doanh thu: ${value} (Tháng: ${label})`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default Dashboard;
