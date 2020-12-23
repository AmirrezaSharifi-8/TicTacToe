'use strict';

const body = document.body;
const indicators = document.querySelectorAll('.indicator');
const board = document.querySelector('.game-board');
const cubes = document.querySelectorAll('.row__piece');
const contents = document.querySelectorAll('.row__piece-content');
const message = document.querySelector('.message');
const messageBox = document.querySelector('.message-box');
const btnAgain = document.querySelector('.again-btn');

const winningChoices = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const classO = 'row__piece-content--o';
const classX = 'row__piece-content--x';
let currentPlayer = 'o';
let statusO = 0;
let statusX = 0;
let statusDraw = 0;

///////////////////////////////////////
/////////////   STYLES   //////////////
///////////////////////////////////////

document.querySelectorAll('.row').forEach((row, i) => {
  if (i !== 2) row.style.marginBottom = '1rem';
});

cubes.forEach((box, i) => {
  if (i !== 2 && i !== 5 && i !== 8) box.style.marginRight = '1rem';

  ///////////////////////////////////////
  /////////////   EVENTS   //////////////
  ///////////////////////////////////////
  const content = contents[i];

  box.addEventListener('click', function () {
    if (
      !content.classList.contains(classO) &&
      !content.classList.contains(classX)
    ) {
      box.dataset.type = currentPlayer;
      box.dataset.isClicked = true;
      checkWinning(winningChoices);
      checkDraw();
      playing(content);
      updateIndicators(currentPlayer);
    }
  });
});

btnAgain.addEventListener('click', function () {
  currentPlayer = 'o';
  againBtnUpdates();
  updateIndicators(currentPlayer);

  cubes.forEach(cube => {
    cube.dataset.type = '';
    cube.dataset.isClicked = false;
  });

  contents.forEach(content => {
    content.classList.remove(classO);
    content.classList.remove(classX);
  });
});

///////////////////////////////////////
///////////   FUNCTIONS   /////////////
///////////////////////////////////////
const playing = element => {
  switch (currentPlayer) {
    case 'o':
      element.classList.add(classO);
      currentPlayer = 'x';
      break;

    case 'x':
      element.classList.add(classX);
      currentPlayer = 'o';
      break;
  }
};

// Styling indicators
const updateIndicators = function (player) {
  indicators.forEach(indicator => {
    indicator.classList.remove('active--o');
    indicator.classList.remove('active--x');
  });

  if (player === 'o') {
    indicators[0].classList.add('active--o');
  } else {
    indicators[1].classList.add('active--x');
  }
};

updateIndicators(currentPlayer);

// A function that will be called when someone wins or nobody wins
const updateUI = function (
  color1,
  color2,
  opacity,
  translateBoard,
  scale,
  zIndex,
  translateMessage,
  messageTxt
) {
  body.style.backgroundImage = `linear-gradient(to top left, ${color1}, ${color2})`;
  indicators.forEach(indicator => (indicator.style.opacity = opacity));
  board.style.transform = `translate(${translateBoard}) scale(${scale})`;
  board.style.zIndex = zIndex;
  messageBox.style.transform = `translate(${translateMessage})`;

  if (messageTxt) message.textContent = messageTxt;
};

// Changes that will occur when someone wins
const winningUpdates = function (player) {
  updateUI(
    '#28b487',
    '#7dd56f',
    '0',
    '-100%, -50%',
    '0.8',
    '0',
    '10%, -50%',
    `Winner : 🎉 ${player} 🎉`
  );

  setTimeout(() => {
    messageBox.style.zIndex = '1';
  }, 250);
};

// Changes that will occur when the again button is clicked
const againBtnUpdates = function () {
  updateUI(
    '#777',
    '#aaa',
    '1',
    '-50%, -50%',
    '1',
    '2',
    '-50%, -50%',
    undefined
  );
  messageBox.style.zIndex = '-1';
};

// Changes that will occur when there is draw status
const drawUpdates = function () {
  updateUI(
    '#99f',
    '#0b8',
    '0',
    '-100%, -50%',
    '0.8',
    '0',
    '10%, -50%',
    'Draw😕'
  );

  setTimeout(() => {
    messageBox.style.zIndex = '1';
  }, 250);
};

// Check if someone is won
const checkWinning = function () {
  winningChoices.forEach(array => {
    array.forEach(correctCubeIndex => {
      if (cubes[correctCubeIndex].dataset.type === 'x') {
        statusX++;
        if (statusX === 3) {
          winningUpdates('X');
        }
      } else if (cubes[correctCubeIndex].dataset.type === 'o') {
        statusO++;
        if (statusO === 3) {
          winningUpdates('O');
        }
      }
    });

    statusO = statusX = 0;
  });
};

// Check the draw status
const checkDraw = function () {
  cubes.forEach(cube => {
    if (cube.dataset.isClicked === 'true') statusDraw++;
    if (statusDraw === 9) drawUpdates();
  });
  statusDraw = 0;
};
