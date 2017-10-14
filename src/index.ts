import { run } from '@cycle/run';
import xs, { Stream } from 'xstream';
import { VNode, DOMSource, makeDOMDriver, div } from '@cycle/dom';
const { makeCanvasDriver, rect } = require('cycle-canvas');
// TODO:
// render an egg
// render a snake
// on load, make the snake move
// the snake responds to keyboard commands
// when the snake eats the egg
//  increase the length of the snake
//  spawn a new egg

type Sources = {
  // DOM : DOMSource;
}

type Sinks = {
  // DOM : Stream<VNode>;
  Canvas : Stream<any>;
}

type Vector = {
  x : number;
  y : number;
}

type Egg = {
  position : Vector;
  height : number;
  width : number;
  color? : string;
}

const CONTAINER_WIDTH = 400;
const CONTAINER_HEIGHT = 600;

function rand(min : number = 0, max : number = 1000) : number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function renderEgg(egg : Egg) : any {
  return rect({
    x: egg.position.x,
    y: egg.position.y,
    width: egg.width,
    height: egg.height,
    draw: [{fill: egg.color || 'red'}]
  })
}

export function main (sources : Sources) : Sinks {
  const egg : Egg = {
    position: {
      x: rand(0, CONTAINER_WIDTH),
      y: rand(0, CONTAINER_HEIGHT)
    },
    height: 10,
    width: 10
  }

  const eggs : Egg[] = [egg];

  return {
    // DOM: xs.of(div('hello world')),
    Canvas: xs.of(
      rect({
        x: 1,
        y: 1,
        width: CONTAINER_WIDTH,
        height: CONTAINER_HEIGHT,
        draw: [{stroke: '#000'}],
        children: eggs.map(renderEgg)
      })
    )
  }
}

const drivers = {
  // DOM: makeDOMDriver('#app'),
  Canvas: makeCanvasDriver('#snake', {width: 605, height: 905 })
}

run(main, drivers)
