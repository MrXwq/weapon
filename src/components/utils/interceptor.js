import { isPromise } from ".";
export function callInterceptor(options) {
  const { interceptor, args, done } = options;

  if (interceptor) {
    const returnVal = interceptor(...args);

    if (isPromise(returnVal)) {
      returnVal
        .then((value) => {
          if (value) {
            done();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (returnVal) {
      done();
    }
  } else {
    done();
  }
}
