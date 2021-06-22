import { activateSide, attemptsMessages } from './helpers.js';
import { sequenceError, sequenceSuccess } from './index.js';

let computerCurrentSequence = [];
let userCurrentSequence = [];
let answerHelper;

function computerSequence(
  computerRegister,
  computerTurn,
  allSides,
  gameMode,
  attempts
) {
  const currentComputerSequence = [...computerRegister.slice(0, computerTurn)];

  if (document.querySelector('#turn'))
    document.querySelector('#turn').innerText = computerTurn - 1;

  if (!isNaN(attempts)) {
    const textAttempts = document.querySelector('.text2');
    textAttempts.innerText = attemptsMessages(attempts);
  }

  computerCurrentSequence = [];
  userCurrentSequence = [];
  answerHelper = undefined;

  currentComputerSequence.forEach((el) =>
    computerCurrentSequence.push(el.side)
  );

  let i = 0;
  let intervalId = setInterval(() => {
    activateSide(currentComputerSequence[i]);
    i++;
    if (i === computerTurn) {
      clearInterval(intervalId);
      userSequence(currentComputerSequence, allSides, gameMode, attempts);
    }
  }, 1000);
}

function userSequence(computerSide, allSides, gameMode, attempts) {
  answerHelper =
    gameMode === 'strict'
      ? checkAnswerStrictMode(computerSide, allSides)
      : checkAnswerNormalMode(computerSide, allSides, attempts);

  allSides.forEach((side) => {
    side.style.cursor = 'pointer';
    side.addEventListener('click', answerHelper);
  });
}

function checkAnswerStrictMode(side, sides) {
  const computerSide = side;
  const allSlides = sides;

  return function (e) {
    userCurrentSequence.push(Number(e.target.dataset.side));
    let keepPlaying = false;

    for (let i = 0; i < userCurrentSequence.length; i++) {
      if (computerCurrentSequence[i] === userCurrentSequence[i]) {
        keepPlaying = true;
      } else {
        keepPlaying = false;
        displayBodyMessage(
          'Game over 😥',
          new Audio('./audio/Sad_Trombone.mp3')
        );
      }
    }

    keepPlaying && activateSide(computerSide[userCurrentSequence.length - 1]);

    if (userCurrentSequence.length === computerCurrentSequence.length) {
      keepPlaying
        ? finishUserTurn(allSlides)
        : displayBodyMessage(
            'Game over 😥',
            new Audio('./audio/Sad_Trombone.mp3')
          );
    }
  };
}

function checkAnswerNormalMode(side, sides, userAttempts) {
  const computerSide = side;
  const allSlides = sides;
  let attempts = userAttempts;

  return function (e) {
    userCurrentSequence.push(Number(e.target.dataset.side));
    let keepPlaying = false;

    for (let i = 0; i < userCurrentSequence.length; i++) {
      if (computerCurrentSequence[i] === userCurrentSequence[i]) {
        keepPlaying = true;
      } else {
        attempts++;
        new Audio('./audio/error.mp3').play();
        if (attempts === 3)
          return displayBodyMessage(
            'Game over, you failed three times in a row 😥',
            new Audio('./audio/Sad_Trombone.mp3')
          );
        return finishUserTurn(allSlides, 'repeat', attempts);
      }
    }

    if (keepPlaying) {
      activateSide(computerSide[userCurrentSequence.length - 1]);
    }

    if (
      userCurrentSequence.length === computerCurrentSequence.length &&
      keepPlaying
    ) {
      finishUserTurn(allSlides);
    }
  };
}

function finishUserTurn(allSides, type, attempts) {
  allSides.forEach((side) => {
    side.style.cursor = 'auto';
    side.removeEventListener('click', answerHelper);
  });

  type === 'repeat' ? sequenceError(attempts) : sequenceSuccess();
}

function displayBodyMessage(message, audioType) {
  audioType.play();

  const body = document.querySelector('body');
  body.innerHTML = `
  <div class="errorWrapper">
    <h1>${message}</h1>
    <button class="restartButton">Restart</button>
  </div>
  `;
  body.style.backgroundColor = 'pink';

  document.querySelector('.restartButton').addEventListener('click', () => {
    window.location.reload();
  });
}

export { computerSequence, userSequence, displayBodyMessage };
