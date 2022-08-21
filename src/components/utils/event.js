/**
 * @Author : ZhangLei
 * @Date : 12/29/18
 * @Version : 1.0
 * @Last Modified by :
 * @Last Modified time : 12/29/18
 * */

let supportsPassive = false;
try {
  const opts = {};
  Object.defineProperty(opts, "passive", {
    get() {
      supportsPassive = true;
      return false;
    },
  });
  window.addEventListener("test-passive", null, opts);
} catch (e) {
  console.log(e);
}

export function on(target, event, handler, passive = false) {
  target.addEventListener(
    event,
    handler,
    supportsPassive ? { capture: false, passive } : false
  );
}

export function off(target, event, handler) {
  target.removeEventListener(event, handler);
}
