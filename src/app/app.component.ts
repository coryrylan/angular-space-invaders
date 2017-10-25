import { AfterViewInit, Component } from '@angular/core';

import { Game, Controls, CollisionDetection } from './game/engine/engine';
import { AsteroidCollection } from './game/entities/asteroid-collection';
import { LaserCollection } from './game/entities/laser-collection';
import { Ship } from './game/entities/ship';

const GAME_STATE = { START: 'START', PLAY: 'PLAY', PAUSE: 'PAUSE', OVER: 'OVER' };
const viewPort = { width: 720, height: 480 };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'app';
  gameScore = 0;
  gameLives = 3;
  GAME_STATE = GAME_STATE;
  gameState = GAME_STATE.START;
  canvasContext: any;
  playerShip = new Ship({ viewPort, lasers: new LaserCollection() });
  asteroids = new AsteroidCollection({ viewPort });
  controls = new Controls();
  game = new Game({ init: () => this.init(), update: () => this.update(), draw: () => this.draw() });

  ngAfterViewInit() {
    this.canvasContext = (document.getElementById('GameCanvas') as any).getContext('2d');
    this.game.start();
    this.setupControlsListeners();
  }

  update() {
    if (this.gameState === GAME_STATE.PLAY) {
      this.asteroids.update();
      this.playerShip.update();
      this.checkShipAndAsteroidCollision();
      this.checkShipLaserAndAsteroidCollision();
    } else {
      return;
    }
  }

  init() {
    window.setInterval(() => {
      if (this.gameState === GAME_STATE.PLAY) {
        this.asteroids.addAsteroid();
      }
    }, 140 - (viewPort.width / 100));
  }

  checkShipAndAsteroidCollision() {
    this.asteroids.list.forEach((asteroid, index) => {
      if (CollisionDetection.check(this.playerShip, asteroid)) {
        this.asteroids.list.splice(index, 1);
        this.removeLife();
      }
    });
  }

  checkShipLaserAndAsteroidCollision() {
    this.playerShip.lasers.list.forEach((laser, laserIndex) => {
      this.asteroids.list.forEach((asteroid, asteroidIndex) => {
        if (CollisionDetection.check(laser, asteroid)) {
          this.playerShip.lasers.list.splice(laserIndex, 1);
          this.asteroids.list.splice(asteroidIndex, 1);
          this.addScore();
        }
      });
    });
  }

  draw() {
    if (this.canvasContext) {
      this.canvasContext.clearRect(0, 0, viewPort.width, viewPort.height);
      if (this.gameState === GAME_STATE.PLAY) {
        this.playerShip.draw(this.canvasContext);
        this.asteroids.draw(this.canvasContext);
      }
    }
  }

  setupControlsListeners() {
    this.controls.on('left', () => {
      if (this.gameState === GAME_STATE.PLAY) {
        this.playerShip.moveLeft();
      }
    });

    this.controls.on('right', () => {
      if (this.gameState === GAME_STATE.PLAY) {
        this.playerShip.moveRight();
      }
    });

    this.controls.on('up', () => {
      if (this.gameState === GAME_STATE.PLAY) {
        this.playerShip.moveUp();
      }
    });

    this.controls.on('down', () => {
      if (this.gameState === GAME_STATE.PLAY) {
        this.playerShip.moveDown();
      }
    });

    this.controls.onKey('space', () => {
      if (this.gameState === GAME_STATE.PLAY) {
        this.playerShip.fire();
      }
    });

    this.controls.onKey('pause', () => {
      this.pauseGame();
    });

    this.controls.onKey('enter', () => {
      if (this.gameState === GAME_STATE.START || this.gameState === GAME_STATE.OVER) {
        this.startNewGame();
      }
    });
  }

  startNewGame() {
    this.gameLives = 3;
    this.gameScore = 0;
    this.gameState = GAME_STATE.PLAY;
  }

  pauseGame() {
    if (this.gameState === GAME_STATE.PLAY) {
      this.gameState = GAME_STATE.PAUSE;
    } else {
      this.gameState = GAME_STATE.PLAY;
    }
  }

  removeLife() {
    if (this.gameLives > 0) {
      this.gameLives -= 1;
    } else {
      this.gameState = GAME_STATE.OVER;
    }
  }

  addScore() {
    this.gameScore += 1;
  }
}
