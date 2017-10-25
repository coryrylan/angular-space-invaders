import { Asteroid } from './asteroid';
import { ViewPort } from './../engine/interfaces';

export class AsteroidCollection {
  list: Asteroid[];
  private options: {
    viewPort: ViewPort;
  };

  constructor(options) {
    this.list = [];
    this.options = options;
  }

  update() {
    this.list.forEach((asteroid, index) => {
      if (asteroid.settings.posY > this.options.viewPort.height + 30) {
        this.list.splice(index, 1);
      }
    });

    this.list.forEach(asteroid => asteroid.update());
  }

  draw(context) {
    this.list.forEach(asteroid => asteroid.draw(context));
  }

  addAsteroid() {
    this.list.push(new Asteroid({ viewPort: this.options.viewPort }));
  }
}
