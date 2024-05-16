let chartInstance = null;

document.getElementById('csvForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('csvFile');
    const chartType = document.getElementById('chartType').value;

    if (fileInput.files.length === 0) {
        alert('Please upload a CSV file');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const csv = e.target.result;
        const data = parseCSV(csv);
        generateChart(data, chartType);
    };

    reader.readAsText(file);
});

function parseCSV(csv) {
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return values.reduce((obj, value, index) => {
            obj[headers[index]] = value;
            return obj;
        }, {});
    });

    return { headers, data };
}

function generateChart(data, chartType) {
    const ctx = document.getElementById('csvChart').getContext('2d');
    const headers = data.headers;
    const dataPoints = data.data;

    const labels = dataPoints.map(point => point[headers[0]]);
    const datasets = headers.slice(1).map((header, index) => {
        return {
            label: header,
            data: dataPoints.map(point => point[header]),
            backgroundColor: `rgba(${index * 30}, 99, 132, 0.2)`,
            borderColor: `rgba(${index * 30}, 99, 132, 1)`,
            borderWidth: 1,
            fill: false
        };
    });

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.getElementById('downloadBtn').addEventListener('click', function() {
    if (chartInstance) {
        const link = document.createElement('a');
        link.href = chartInstance.toBase64Image();
        link.download = 'chart.png';
        link.click();
    } else {
        alert('Please generate a chart first');
    }
});