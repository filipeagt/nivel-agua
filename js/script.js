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
      label: 'Histórico do Nível de Água (cm)',
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
  
  waterLevelDisplay.textContent = `Nível de água atual: ${levels[levels.length-1].level} cm`;
  waterLevelElement.style.height = `${levels[levels.length-1].level}%`;
  
  // Remove os dados antigos
  for (let i=0;i<levels.length;i++) {
    
    chart.data.labels.pop();
    chart.data.datasets[0].data.pop();
  
    chart.update();
  }
  // Adicionar dados ao gráfico
  for (let i=0;i<levels.length;i++) {
    const now = new Date(levels[i].time * 1000) //Faz a conversão do unixTimestamp para Date
    chart.data.labels.push(now.toLocaleString());
    chart.data.datasets[0].data.push(levels[i].level);

    chart.update();
  }
}

function updateWaterLevelElement(level) {
  
  const waterLevelDisplay = document.getElementById('waterLevelDisplay');
  const waterLevelElement = document.getElementById('waterLevel');
  
  waterLevelDisplay.textContent = `Nível de água atual: ${level} cm`;
  waterLevelElement.style.height = `${level}%`;
}

// Conectar ao broker MQTT
client.on('connect', () => {
  console.log('Conectado ao broker MQTT');
  client.subscribe(topic);
});

// Receber mensagens
client.on('message', (topic, message) => {
  if (isNaN(message.toString())) { //Se mensagem não numérica
    const levels = JSON.parse(message.toString());
    if (!isNaN(levels[0].level)) {
      updateWaterLevel(levels);
    }
  } else { //Se numérica
    updateWaterLevelElement(message.toString())
  }
  
  //alert(levels[0].level)
});
