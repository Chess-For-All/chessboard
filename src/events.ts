import { State } from './state'
import * as drag from './drag'
import * as draw from './draw'
import { isRightClick, raf } from './util'
import * as cg from './types'

type MouchBind = (e: cg.MouchEvent) => void;
type StateMouchBind = (d: State, e: cg.MouchEvent) => void;

export function bindBoard(s: State): void {

  const boardEl = s.dom.elements.board;

  if (!s.viewOnly) {
    ['touchstart', 'mousedown'].forEach(ev => boardEl.addEventListener(ev, startDragOrDraw(s)));
  }

  if (s.disableContextMenu || s.drawable.enabled) {
    boardEl.addEventListener('contextmenu', e => {
      e.preventDefault();
      return false;
    });
  }
}

// returns the unbind function
export function bindDocument(s: State, redrawAll: cg.Redraw): cg.Unbind {

  const onmove: MouchBind = dragOrDraw(s, drag.move, draw.move);
  const onend: MouchBind = dragOrDraw(s, drag.end, draw.end);

  const unbinds: cg.Unbind[] = [];

  if (!s.viewOnly) {
    ['touchmove', 'mousemove'].forEach(ev => unbinds.push(unbindable(document, ev, onmove)));
    ['touchend', 'mouseup'].forEach(ev => unbinds.push(unbindable(document, ev, onend)));
  }

  const onResize = () => {
    s.dom.bounds.clear();
    raf(redrawAll);
  };
  if (s.resizable) unbinds.push(unbindable(document.body, 'chessground.resize', onResize));

  const onScroll = () => s.dom.bounds.clear();
  unbinds.push(unbindable(window, 'scroll', onScroll, { passive: true }));
  unbinds.push(unbindable(window, 'resize', onScroll, { passive: true }));

  return () => unbinds.forEach(f => f());
}

function unbindable(el: EventTarget, eventName: string, callback: MouchBind, options?: any): cg.Unbind {
  el.addEventListener(eventName, callback, options);
  return () => el.removeEventListener(eventName, callback);
}

function startDragOrDraw(s: State): MouchBind {
  return e => {
    if (isRightClick(e) && s.draggable.current) {
      if (s.draggable.current.newPiece) delete s.pieces[s.draggable.current.orig];
      s.draggable.current = undefined;
      s.selected = undefined;
    } else if ((e.shiftKey || isRightClick(e)) && s.drawable.enabled) draw.start(s, e);
    else drag.start(s, e);
  };
}

function dragOrDraw(s: State, withDrag: StateMouchBind, withDraw: StateMouchBind): MouchBind {
  return e => {
    if ((e.shiftKey || isRightClick(e)) && s.drawable.enabled) withDraw(s, e);
    else if (!s.viewOnly) withDrag(s, e);
  };
}
