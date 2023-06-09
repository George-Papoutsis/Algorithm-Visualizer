const numBars = 50;
const delay = 15;

let audioCtx = null;
async function playNote(frequency) {
  if (audioCtx == null) {
    audioCtx = new (AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext)();
  }

  const duration = 0.1;
  const oscillator = audioCtx.createOscillator();
  oscillator.frequency.value = frequency;
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
  oscillator.connect(node);
  node.connect(audioCtx.destination);
}

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

let chosenAlgorithm = 0;
const algorithms = ["Selection Sort", "Insertion Sort", "Bubble Sort"];

const newArrayButton = document.querySelector(".newArrayButton");
const algorithmsButton = document.querySelector(".algorithmsButton");
const algorithmOptions = document.querySelector(".algorithmOptions");
const runButton = document.querySelector(".runButton");

const selectionSortButton = document.getElementById("SelectionSort");
const insertionSortButton = document.getElementById("InsertionSort");
const quickSortButton = document.getElementById("QuickSort");

const visualizerWindow = document.querySelector(".algorithmVisualizer");
visualizerWindow.style.grid = `100% / repeat(${numBars}, 1fr)`;

newArrayButton.addEventListener("click", initVisualizer);
algorithmsButton.addEventListener("click", function () {
  algorithmsButton.classList.toggle("closed");
  algorithmsButton.classList.toggle("open");
  algorithmOptions.classList.toggle("hide");
});

for (let i = 0; i < algorithmOptions.children.length; i++) {
  algorithmOptions.children[i].addEventListener("click", () => {
    chosenAlgorithm = i + 1;
    algorithmsButton.classList.toggle("closed");
    algorithmsButton.classList.toggle("open");
    algorithmOptions.classList.toggle("hide");
    algorithmsButton.innerText = algorithms[i];
  });
}

runButton.addEventListener("click", () => {
  if (chosenAlgorithm == 0) {
    alert("You must choose an algorithm");
  }
  if (chosenAlgorithm == 1) {
    selectionSort();
  }

  if (chosenAlgorithm == 2) {
    insertionSort();
  }

  if (chosenAlgorithm == 3) {
    bubbleSort();
  }
});

function initVisualizer() {
  while (visualizerWindow.hasChildNodes()) {
    visualizerWindow.removeChild(visualizerWindow.firstChild);
  }

  for (let i = 0; i < numBars; i++) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${Math.floor(Math.random() * 100) + 1}%`;
    visualizerWindow.appendChild(bar);
  }
}

initVisualizer();

async function setCurrent(index) {
  runButton.disabled = true;
  newArrayButton.disabled = true;
  visualizerWindow.children[index].classList.toggle("current");
  await playNote(
    200 + parseInt(visualizerWindow.children[index].style.height) * 15
  );
  await timer(delay);
  visualizerWindow.children[index].classList.toggle("current");
}

async function selectionSort() {
  for (let i = 0; i < numBars; i++) {
    let min = i;

    await setCurrent(i);

    for (let j = i + 1; j < numBars; j++) {
      await setCurrent(j);
      await setCurrent(min);
      if (
        parseInt(visualizerWindow.children[j].style.height) <
        parseInt(visualizerWindow.children[min].style.height)
      ) {
        min = j;
      }
    }

    if (min != i) {
      visualizerWindow.insertBefore(
        visualizerWindow.children[min],
        visualizerWindow.children[i]
      );
    }
  }

  runButton.disabled = false;
  newArrayButton.disabled = false;
}

async function insertionSort() {
  for (let i = 1; i < numBars; i++) {
    await setCurrent(i);
    let key = visualizerWindow.children[i].style.height;
    let j = i - 1;

    while (
      j >= 0 &&
      parseInt(key) < parseInt(visualizerWindow.children[j].style.height)
    ) {
      await setCurrent(j);
      visualizerWindow.children[j + 1].style.height =
        visualizerWindow.children[j].style.height;
      j -= 1;
    }
    visualizerWindow.children[j + 1].style.height = key;
  }
  runButton.disabled = false;
  newArrayButton.disabled = false;
}

async function bubbleSort() {
  for (let i = 0; i < numBars - 1; i++) {
    for (let j = 0; j < numBars - i - 1; j++) {
      await setCurrent(j);
      if (
        parseInt(visualizerWindow.children[j].style.height) >
        parseInt(visualizerWindow.children[j + 1].style.height)
      ) {
        visualizerWindow.insertBefore(
          visualizerWindow.children[j + 1],
          visualizerWindow.children[j]
        );
      }
    }
  }
  runButton.disabled = false;
  newArrayButton.disabled = false;
}
