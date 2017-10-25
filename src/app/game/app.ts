import { Game, Controls, CollisionDetection } from './engine/engine';
import { AsteroidCollection } from './asteroid-collection';
import { LaserCollection } from './laser-collection';
import { Ship } from './ship';

export function main() {
  'use strict';

  // Game Globals
  const GAME_STATE = { START: 'START', PLAY: 'PLAY', PAUSE: 'PAUSE', OVER: 'OVER' };
  const canvasContext = (document.getElementById('GameCanvas') as any).getContext('2d');
  let gameState = GAME_STATE.START;
  let gameScore = 0;
  let gameLives = 3;
  const viewPort = {
    width: 720,
    height: 480
  };

  // region Game
  const playerShip = new Ship({ viewPort, lasers: new LaserCollection() });
  const asteroids = new AsteroidCollection({ viewPort: viewPort });
  const controls = new Controls();
  const game = new Game({ init, update, draw });
  game.start();

  function init() {
    window.setInterval(() => {
      if (gameState === GAME_STATE.PLAY) {
        asteroids.addAsteroid();
      }
    }, 140 - (viewPort.width / 100));
  }

  function update() {
    if (gameState === GAME_STATE.PLAY) {
      asteroids.update();
      playerShip.update();
      checkShipAndAsteroidCollision();
      checkShipLaserAndAsteroidCollision();
    } else {
      return;
    }
  }

  function draw() {
    canvasContext.clearRect(0, 0, viewPort.width, viewPort.height);
    drawScore();
    drawLives();

    if (gameState === GAME_STATE.START) {
      drawStartScreen();
    } else if (gameState === GAME_STATE.PLAY) {
      playerShip.draw(canvasContext);
      asteroids.draw(canvasContext);
    } else if (gameState === GAME_STATE.PAUSE) {
      console.log('Paused');
    } else if (gameState === GAME_STATE.OVER) {
      endGame();
    } else {
      drawStartScreen();
    }
  }

  function checkShipAndAsteroidCollision() {
    asteroids.list.forEach((asteroid, index) => {
      if (CollisionDetection.check(playerShip, asteroid)) {
        asteroids.list.splice(index, 1);
        removeLife();
      }
    });
  }

  function checkShipLaserAndAsteroidCollision() {
    playerShip.lasers.list.forEach((laser, laserIndex) => {
      asteroids.list.forEach((asteroid, asteroidIndex) => {
        if (CollisionDetection.check(laser, asteroid)) {
          playerShip.lasers.list.splice(laserIndex, 1);
          asteroids.list.splice(asteroidIndex, 1);
          addScore();
        }
      });
    });
  }
  // endregion

  // region Key Game Controls
  controls.on('left', () => {
    if (gameState === GAME_STATE.PLAY) {
      playerShip.moveLeft();
    }
  });

  controls.on('right', () => {
    if (gameState === GAME_STATE.PLAY) {
      playerShip.moveRight();
    }
  });

  controls.on('up', () => {
    if (gameState === GAME_STATE.PLAY) {
      playerShip.moveUp();
    }
  });

  controls.on('down', () => {
    if (gameState === GAME_STATE.PLAY) {
      playerShip.moveDown();
    }
  });

  controls.onKey('space', () => {
    if (gameState === GAME_STATE.PLAY) {
      playerShip.fire();
    }
  });

  controls.onKey('pause', () => {
    pauseGame();
  });

  controls.onKey('enter', () => {
    if (gameState === GAME_STATE.START || gameState === GAME_STATE.OVER) {
      startNewGame();
    }
  });
  // endregion

  // region Helper Functions
  function drawStartScreen() {
    const screen: any = document.querySelector('.js-start-screen');
    screen.style.display = screen.style.display === 'none' ? 'block' : 'none';
  }

  function hideStartScreen() {
    const screen: any = document.querySelector('.js-start-screen');
    screen.style.display = 'none';
  }

  function startNewGame() {
    gameLives = 3;
    gameState = GAME_STATE.PLAY;
    gameScore = 0;
    hideStartScreen();

    const screen: any = document.querySelector('.js-game-over-screen');
    screen.style.display = 'none';
  }

  function pauseGame() {
    drawPauseScreen();

    if (gameState === GAME_STATE.PLAY) {
      gameState = GAME_STATE.PAUSE;
    } else {
      gameState = GAME_STATE.PLAY;
    }
  }

  function drawPauseScreen() {
    const screen: any = document.querySelector('.js-pause-screen');
    screen.style.display = screen.style.display === 'none' ? 'block' : 'none';
  }

  function endGame() {
    const screen: any = document.querySelector('.js-game-over-screen');
    screen.style.display = 'block';
  }

  function addScore() {
    gameScore += 1;
  }

  function drawScore() {
    const screen: any = document.querySelector('.js-score');
    screen.innerHTML = `Score: ${gameScore}`;
  }

  function removeLife() {
    if (gameLives > 0) {
      gameLives -= 1;
    } else {
      gameState = GAME_STATE.OVER;
    }
  }

  function drawLives() {
    const screen: any = document.querySelector('.js-lives');
    screen.innerHTML = `Lives: ${gameLives}`;
  }
  // endregion
}
