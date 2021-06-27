import { randomSide, removeStartButton } from './helpers.js';
import { computerSequence, displayBodyMessage } from './UI.js';

const start = document.querySelector('#start');
const on = document.querySelector('#on');
const strict = document.querySelector('#strict');
const sides = document.querySelectorAll('[data-side]');
const audios = document.querySelectorAll('audio');
const formDifficulty = document.querySelector('.form-difficulty');
const difficultyLevelInput = document.querySelector('.difficultyLevel');

let attempts = {
  normal: 0,
  strict: undefined,
};
let difficultyLevel = 3;
let computerRegister = [];
let computerTurn = 1;

function startGame() {
  let i = 0;
  while (i < difficultyLevel) {
    i++;
    const side = randomSide(sides);
    const sideNumber = Number(side.dataset.side);
    const audioNumber = audios[sideNumber - 1];
    computerRegister.push({
      side: sideNumber,
      audio: audioNumber,
      element: side,
    });
  }

  computerSequence(
    computerRegister,
    computerTurn,
    sides,
    strict.checked ? 'strict' : 'normal',
    strict.checked ? attempts.strict : attempts.normal
  );
}

function sequenceSuccess() {
  attempts.normal = 0;
  if (computerTurn !== difficultyLevel) {
    computerTurn++;
    setTimeout(() => {
      computerSequence(
        computerRegister,
        computerTurn,
        sides,
        strict.checked ? 'strict' : 'normal',
        strict.checked ? attempts.strict : attempts.normal
      );
    }, 100);
  } else {
    displayBodyMessage('You won! 😃😃😀', new Audio('./audio/Ta-Da.mp3'));
  }
}

function sequenceError(attemptQty) {
  attempts.normal = attemptQty;
  if (computerTurn !== difficultyLevel) {
    setTimeout(() => {
      computerSequence(
        computerRegister,
        computerTurn,
        sides,
        strict.checked ? 'strict' : 'normal',
        strict.checked ? attempts.strict : attempts.normal
      );
    }, 400);
  } else {
    displayBodyMessage('You won! 😃😃😀', new Audio('./audio/Ta-Da.mp3'));
  }
}

function resetGame() {
  window.location.reload();
}

function handleStart() {
  removeStartButton(start);
  formDifficulty.style.display = 'none';
  startGame();
  document.querySelector('.difficultyInput').disabled = true;

  start.disabled = true;
  on.disabled = true;
  strict.disabled = true;
}

function handlePower(e) {
  start.disabled = e.target.checked ? false : true;
  document.querySelector('#turn').innerText = e.target.checked ? '✳' : '';
}

function handleForm(e) {
  e.preventDefault();
  const radioBtn = document.querySelector('input[name="chooseone"]:checked');
  difficultyLevel = Number(radioBtn.value);
  difficultyLevelInput.innerText = radioBtn.nextElementSibling.htmlFor;
}

start.addEventListener('click', handleStart);
on.addEventListener('change', handlePower);
formDifficulty.addEventListener('submit', handleForm);

export { sequenceError, sequenceSuccess, resetGame };
