import { Laser } from './laser';

export class LaserCollection {
  maxLasers: number;
  list: Laser[];

  constructor() {
    this.maxLasers = 10;
    this.list = [];
  }

  update() {
    this.list.forEach((laser, index) => {
      if (this.isLaserOutOfTopBounds(index)) {
        this.list.shift();
      }
    });

    this.list.forEach(laser => laser.update());
  }

  draw(context) {
    this.list.forEach(laser => laser.draw(context));
  }

  fire(posX: number, posY: number) {
    if (this.list.length < this.maxLasers) {
      const laser = new Laser(posX, posY);
      this.list.push(laser);
      laser.playSound();
    }
  }

  private isLaserOutOfTopBounds(index: number) {
    return this.list[index].settings.posY < -5;
  }
}
