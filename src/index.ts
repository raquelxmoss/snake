import { run } from '@cycle/run';
import xs, { Stream } from 'xstream';
import { VNode, DOMSource, makeDOMDriver, div } from '@cycle/dom';
import { timeDriver, TimeSource } from '@cycle/time';
const { makeCanvasDriver, rect } = require('cycle-canvas');
// TODO:
// ~render an egg~
// ~render a snake~
// ~on load, make the snake move~
// the snake responds to keyboard commands
// when the snake eats the egg
//  increase the length of the snake
//  spawn a new egg

type Sources = {
  Time : TimeSource
}

type Sinks = {
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

type Snake = {
  length: number;
  width: number;
  headPosition: Vector;
  color?: string;
  direction : 'N' | 'S' | 'W' | 'E';
}

type AppState = {
  eggs : Egg[];
  snake : Snake;
  previousSnake: Snake;
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
  });
}

function clearPreviousSnake(snake: Snake) : any {
  if (!snake) { return; }
  return rect({
    x: snake.headPosition.x,
    y: snake.headPosition.y,
    width: snake.width,
    height: snake.length,
    draw: [{ clear: true }]
  });
}

function snakeWidth(snake : Snake) : number {
  switch(snake.direction) {
    case 'E':
      return snake.length;
    case 'S':
      return snake.width;
    case 'W':
      return - snake.length;
    case 'N':
      return snake.width;
  }
}

function snakeHeight(snake: Snake) : number {
  switch(snake.direction) {
    case 'E':
      return snake.width;
    case 'S':
      return snake.length;
    case 'W':
      return snake.width;
    case 'N':
      return - snake.length;
  }
}

function renderSnake(snake : Snake) : any {
  return rect({
    x: snake.headPosition.x,
    y: snake.headPosition.y,
    width: snakeWidth(snake),
    height: snakeHeight(snake),
    draw: [{ fill: snake.color || 'black' }]
  });
}

function view (state : AppState) {
  const children = [
    clearPreviousSnake(state.previousSnake),
    renderSnake(state.snake),
    ...state.eggs.map(renderEgg)
  ];

  return rect({
    x: 1,
    y: 1,
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    draw: [{stroke: '#000'}],
    children
  });
}

function update(state : AppState) : AppState {
  const previousSnake = state.snake;

  const headPosition = {
    x: state.snake.headPosition.x + 1,
    y: state.snake.headPosition.y
  }

  const snake = Object.assign({}, state.snake, { headPosition });

  return Object.assign({}, state, { snake, previousSnake });
}

export function main (sources : Sources) : Sinks {
  const frames$ = sources.Time.animationFrames();

  const egg : Egg = {
    position: {
      x: rand(0, CONTAINER_WIDTH),
      y: rand(0, CONTAINER_HEIGHT)
    },
    height: 10,
    width: 10
  }

  const snake : Snake = {
    headPosition: {
      x: CONTAINER_WIDTH / 2,
      y: CONTAINER_HEIGHT / 2
    },
    length: 10,
    width: 10,
    color: 'green',
    direction: 'E'
  }

  const initialState : AppState = {
    eggs: [egg],
    snake,
    previousSnake: null
  }

  const update$ = frames$.map(frame => (state : AppState) => update(state));
  const reducer$ = xs.merge(update$);
  const state$ = reducer$.fold((state, reducer) => reducer(state), initialState);

  return {
    Canvas: state$.map(view)
  }
}

const drivers = {
  Canvas: makeCanvasDriver('#snake', { width: 605, height: 905 }),
  Time: timeDriver
}

run(main, drivers)
