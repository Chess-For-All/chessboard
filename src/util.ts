import * as cg from './types';

export const colors: cg.Color[] = ['white', 'black'];

export const invRanks: cg.Rank[] = [8, 7, 6, 5, 4, 3, 2, 1];

export const allKeys: cg.Key[] = Array.prototype.concat(...cg.files.map(c => cg.ranks.map(r => c+r)));

export const pos2key = (pos: cg.Pos) => allKeys[8 * pos[0] + pos[1] - 9];

export const key2pos = (k: cg.Key) => [k.charCodeAt(0) - 96, k.charCodeAt(1) - 48] as cg.Pos;

export function memo<A>(f: () => A): cg.Memo<A> {
  let v: A | undefined;
  const ret: any = () => {
    if (v === undefined) v = f();
    return v;
  };
  ret.clear = () => { v = undefined; };
  return ret;
}

export const timer: () => cg.Timer = () => {
  let startAt: Date | undefined;
  return {
    start() { startAt = new Date(); },
    cancel() { startAt = undefined; },
    stop() {
      if (!startAt) return 0;
      const time = Date.now() - startAt.getTime();
      startAt = undefined;
      return time;
    }
  };
}

export const opposite = (c: cg.Color) => c === 'white' ? 'black' : 'white';

export function containsX<X>(xs: X[] | undefined, x: X): boolean {
  return xs ? xs.indexOf(x) !== -1 : false;
}

export const distanceSq: (pos1: cg.Pos, pos2: cg.Pos) => number = (pos1, pos2) => {
  return Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2);
}

export const samePiece: (p1: cg.Piece, p2: cg.Piece) => boolean = (p1, p2) =>
  p1.role === p2.role && p1.color === p2.color;

interface CSSStyleDeclaration {
  [key: string]: any;
}

const s = document.body.style;
const prop = 'transform' in s ?
  'transform' : 'webkitTransform' in s ?
  'webkitTransform' : 'mozTransform' in s ?
  'mozTransform' : 'oTransform' in s ?
  'oTransform' : 'msTransform';

export const transformFunction = (el: HTMLElement, value: string) => {
  (el.style as CSSStyleDeclaration)[prop] = value;
};

export const computeIsTrident = () => window.navigator.userAgent.indexOf('Trident/') > -1;

export const posToTranslate = (pos: cg.Pos, asWhite: boolean, bounds: ClientRect): cg.NumberPair => [
  (asWhite ? pos[0] - 1 : 8 - pos[0]) * bounds.width / 8,
  (asWhite ? 8 - pos[1] : pos[1] - 1) * bounds.height / 8
];

export const translate = (pos: cg.Pos) => 'translate(' + pos[0] + 'px,' + pos[1] + 'px)';

export const translateAway: string = translate([-99999, -99999]);

// touchend has no position!
export const eventPosition: (e: cg.MouchEvent) => cg.NumberPair | undefined = e => {
  if (e.clientX || e.clientX === 0) return [e.clientX, e.clientY];
  if (e.touches && e.targetTouches[0]) return [e.targetTouches[0].clientX, e.targetTouches[0].clientY];
  return undefined;
}

export const isRightButton = (e: MouseEvent) => e.buttons === 2 || e.button === 2;

export const createEl = (tagName: string, className?: string) => {
  const el = document.createElement(tagName);
  if (className) el.className = className;
  return el;
}

export const raf = (window.requestAnimationFrame || window.setTimeout).bind(window);
