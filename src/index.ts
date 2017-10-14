import { run } from '@cycle/run';
import xs, { Stream } from 'xstream';
import { VNode, DOMSource, makeDOMDriver, div } from '@cycle/dom';

type Sources = {
  DOM : DOMSource;
}

type Sinks = {
  DOM : Stream<VNode>;
}

export function main (sources : Sources) : Sinks {
  return {
    DOM: xs.of(div('hello world'))
  }
}

const drivers = {
  DOM: makeDOMDriver('#app')
}

run(main, drivers)
