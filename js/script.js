// Configuração do cliente MQTT
const client = mqtt.connect('wss://test.mosquitto.org:8081');
const topic = 'water/tank/level';

// Configuração do gráfico
const ctx = document.getElementById('waterLevelChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Nível de Água (%)',
      data: [],
      borderColor: '#0077be',
      tension: 0.1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }
});

// Atualizar o gráfico e o display
function updateWaterLevel(level) {
  const waterLevelDisplay = document.getElementById('waterLevelDisplay');
  const waterLevelElement = document.getElementById('waterLevel');
  
  waterLevelDisplay.textContent = `Nível de água: ${level}%`;
  waterLevelElement.style.height = `${level}%`;

  // Adicionar dados ao gráfico
  const now = new Date();
  chart.data.labels.push(now.toLocaleTimeString());
  chart.data.datasets[0].data.push(level);

  // Manter apenas os últimos 10 pontos de dados
  if (chart.data.labels.length > 10) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update();
}

// Conectar ao broker MQTT
client.on('connect', () => {
  console.log('Conectado ao broker MQTT');
  client.subscribe(topic);
});

// Receber mensagens
client.on('message', (topic, message) => {
  const level = parseFloat(message.toString());
  if (!isNaN(level)) {
    updateWaterLevel(level);
  }
});

// Simular dados para demonstração
/*let simulatedLevel = 50;
setInterval(() => {
  simulatedLevel += (Math.random() - 0.5) * 10;
  simulatedLevel = Math.min(100, Math.max(0, simulatedLevel));
  updateWaterLevel(simulatedLevel.toFixed(1));
}, 2000);*/