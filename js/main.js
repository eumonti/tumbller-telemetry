const terminal = new BluetoothTerminal();

/* DOM elements */
const status = document.getElementById("status");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");

let connected = false;
let pause = false;

const data = [
  {
    name: "Angle",
    y: [0],
    type: "line",
  },
  // {
  //   name: "Angle6",
  //   y: [0],
  //   type: "line",
  // },
  // {
  //   name: "GyroX",
  //   y: [0],
  //   type: "line",
  // },
];

const config = { responsive: true };

pauseBtn.addEventListener("click", () => {
  if (pause) {
    pauseBtn.innerText = "Pausa";
    terminal.receive = handleReceivedData;
  } else {
    pauseBtn.innerText = "Riprendi";
    terminal.receive = () => {};
  }
  pause = !pause;
});

startBtn.addEventListener("click", () => {
  if (connected) {
    terminal.disconnect();
    startBtn.innerText = "Connetti";
    connected = false;
    status.innerText = "Disconnesso.";
  } else {
    terminal.connect().then(() => {
      startBtn.innerText = "Disconnetti";
      connected = true;
      status.innerText = `Connesso a ${terminal.getDeviceName()}.`;
    });
  }
});

let cnt = 0;
const handleReceivedData = (rawData) => {
  const data = rawData.split(" ");
  Plotly.extendTraces(
    "chart",
    { y: [[data[0]]] },
    [0]
  );
  cnt++;
  if (cnt > 250) {
    Plotly.relayout("chart", {
      xaxis: {
        range: [cnt - 250, cnt],
      },
    });
  }
};

Plotly.newPlot("chart", data, {}, config);

terminal.receive = handleReceivedData;
