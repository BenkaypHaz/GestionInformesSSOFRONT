export const chartColors = {
  default: {
    primary: '#00D1B2',
    info: '#209CEE',
    danger: '#FF3860'
  }
}

const randomChartData = (n) => {
  const data = []

  for (let i = 0; i < n; i++) {
    data.push(Math.round(Math.random() * 200))
  } 

  return data
}

const datasetObject = (color, points) => {
  return {
    fill: false,
    borderColor: chartColors.default[color],
    borderWidth: 2,
    borderDash: [],
    borderDashOffset: 0.0,
    pointBackgroundColor: chartColors.default[color],
    pointBorderColor: 'rgba(255,255,255,0)',
    pointHoverBackgroundColor: chartColors.default[color],
    pointBorderWidth: 20,
    pointHoverRadius: 4,
    pointHoverBorderWidth: 15,
    pointRadius: 4,
    data: randomChartData(points),
    tension: 0.5,
    cubicInterpolationMode: 'default'
  }
}

// Dataset generator for bar charts
const barDatasetObject = (color, points) => {
  return {
    backgroundColor: chartColors.default[color],
    borderColor: chartColors.default[color],
    borderWidth: 2,
    hoverBackgroundColor: chartColors.default[color],
    hoverBorderColor: 'rgba(255,255,255,1)',
    data: randomChartData(points),
  };
};

const radarDatasetObject = (color, points) => {
  return {
    label: `${color} data`,
    backgroundColor: `${chartColors.default[color]}33`, // Transparent color
    borderColor: chartColors.default[color],
    borderWidth: 2,
    pointBackgroundColor: chartColors.default[color],
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: chartColors.default[color],
    data: randomChartData(points)
  };
};

const randomChartValue = () => Math.round(Math.random() * 100);

// Dataset generator for pie charts
const pieDatasetObject = () => {
  return {
    data: [randomChartValue(), randomChartValue(), randomChartValue(), randomChartValue(), randomChartValue()],
    backgroundColor: [
      chartColors.default.danger,
      chartColors.default.info,
      chartColors.default.warning,
      chartColors.default.success,
      chartColors.default.primary
    ],
    hoverOffset: 4
  };
};



export const sampleChartData = (points = 9) => {
  const labels = []

  for (let i = 1; i <= points; i++) {
    labels.push(`0${i}`)
  }

  return {
    labels,
    datasets: [
      datasetObject('primary', points),
      datasetObject('info', points),
      datasetObject('danger', points)
    ]
  }
}

// Sample data for bar charts
export const sampleBarChartData = (points = 9) => {
  const labels = [];
  for (let i = 1; i <= points; i++) {
    labels.push(`Item ${i}`);
  }

  return {
    labels,
    datasets: [
      barDatasetObject('primary', points),
      barDatasetObject('info', points),
      barDatasetObject('danger', points)
    ]
  };
};

export const sampleRadarChartData = (points = 6) => { // Fewer points by default, adjust as needed
  return {
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling'],
    datasets: [
      radarDatasetObject('primary', points),
      radarDatasetObject('info', points),
      radarDatasetObject('danger', points)
    ]
  };
};

export const samplePieChartData = () => {
  return {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
    datasets: [
      pieDatasetObject()
    ]
  };
};