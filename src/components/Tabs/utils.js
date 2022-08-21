import { raf, cancelRaf } from "../utils/raf";
import { getScrollTop, setScrollTop } from "../utils/scroll";

let scrollLeftRafId;

export function scrollLeftTo(scroller, to, duration) {
  cancelRaf(scrollLeftRafId);

  let count = 0;
  const from = scroller.scrollLeft;
  const frames = duration === 0 ? 1 : Math.round((duration * 1000) / 16);

  function animate() {
    scroller.scrollLeft += (to - from) / frames;

    // eslint-disable-next-line no-plusplus
    if (++count < frames) {
      scrollLeftRafId = raf(animate);
    }
  }

  animate();
}

export function scrollTopTo(scroller, to, duration, callback) {
  let current = getScrollTop(scroller);

  const isDown = current < to;
  const frames = duration === 0 ? 1 : Math.round((duration * 1000) / 16);
  const step = (to - current) / frames;

  function animate() {
    current += step;

    if ((isDown && current > to) || (!isDown && current < to)) {
      current = to;
    }

    setScrollTop(scroller, current);

    if ((isDown && current < to) || (!isDown && current > to)) {
      raf(animate);
    } else if (callback) {
      raf(callback);
    }
  }

  animate();
}
