// Configuração do cliente MQTT
const client = mqtt.connect('wss://test.mosquitto.org:8081');
const topic = 'water/tank/level';

// Configuração do gráfico
const ctx = document.getElementById('waterLevelChart').getContext('2d');
var chart = new Chart(ctx, {
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
function updateWaterLevel(levels) {
  
  const waterLevelDisplay = document.getElementById('waterLevelDisplay');
  const waterLevelElement = document.getElementById('waterLevel');
  
  waterLevelDisplay.textContent = `Nível de água: ${levels[levels.length-1].level}%`;
  waterLevelElement.style.height = `${levels[levels.length-1].level}%`;
  
  // Remove os dados antigos
  for (let i=0;i<levels.length;i++) {
    
    chart.data.labels.pop();
    chart.data.datasets[0].data.pop();
  
    chart.update();
  }
  // Adicionar dados ao gráfico
  for (let i=0;i<levels.length;i++) {
    const now = new Date(levels[i].time)
    chart.data.labels.push(now.toLocaleString());
    chart.data.datasets[0].data.push(levels[i].level);

    chart.update();
  }
}

// Conectar ao broker MQTT
client.on('connect', () => {
  console.log('Conectado ao broker MQTT');
  client.subscribe(topic);
});

// Receber mensagens
client.on('message', (topic, message) => {
  const levels = JSON.parse(message.toString());
  if (!isNaN(levels[0].level)) {
    updateWaterLevel(levels);
  }
  //alert(levels[0].level)
});
