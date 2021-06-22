import { resetGame } from './index.js';

const switches = document.querySelector('#switches');
const strict = document.querySelector('#strict');

function randomSide(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function removeStartButton(start) {
  const button = document.createElement('button');

  button.classList.add('button');
  button.id = 'reset';
  button.innerText = 'Reset';
  start.remove();

  const insertedElement = switches.insertBefore(button, strict);
  insertedElement.addEventListener('click', () => {
    resetGame();
  });
}

function setStartButton(start) {
  const resetButton = document.querySelector('#reset');
  resetButton.remove();
  switches.insertBefore(start, strict);
}

function activateSide(currentComputerSequence) {
  let className;
  switch (currentComputerSequence.side) {
    case 1:
      className = 'topleftOn';
      break;
    case 2:
      className = 'toprightOn';
      break;
    case 3:
      className = 'bottomleftOn';
      break;
    case 4:
      className = 'bottomrightOn';
      break;
    default:
      className = undefined;
  }

  currentComputerSequence.element.classList.add(className);
  currentComputerSequence.audio.pause();
  currentComputerSequence.audio.currentTime = 0;
  currentComputerSequence.audio.play();

  setTimeout(() => {
    currentComputerSequence.element.classList.remove(className);
  }, 400);

  return className;
}

const attemptsMessages = (number) => {
  const attempts = ['Fresh 😀', '2 Attempts left 😐', '1 Attempt left 😣'];

  return attempts[number];
};

export {
  randomSide,
  removeStartButton,
  setStartButton,
  activateSide,
  attemptsMessages,
};
