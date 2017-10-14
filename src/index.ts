import { run } from '@cycle/run';
import xs, { Stream } from 'xstream';
import { VNode, DOMSource, makeDOMDriver, div } from '@cycle/dom';
const { makeCanvasDriver, rect } = require('cycle-canvas');

type Sources = {
  // DOM : DOMSource;
}

type Sinks = {
  // DOM : Stream<VNode>;
  Canvas : Stream<any>;
}

export function main (sources : Sources) : Sinks {
  return {
    // DOM: xs.of(div('hello world')),
    Canvas: xs.of(
      rect({
        x: 1,
        y: 1,
        width: 400,
        height: 600,
        draw: [{stroke: '#000'}],
        children: []
      })
    )
  }
}

const drivers = {
  // DOM: makeDOMDriver('#app'),
  Canvas: makeCanvasDriver('#snake', {width: 605, height: 905 })
}

run(main, drivers)
