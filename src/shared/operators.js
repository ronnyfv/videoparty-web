import { Observable } from "rxjs";

Observable.prototype.safeSubscribe = function (next, error, complete) {
  const subscription = this.subscribe(
    item => {
      try {
        next(item);
      } catch (error) {
        console.error(error.stack || error);
        subscription.unsubscribe();
      }
    },
    error,
    complete
  );

  return subscription;
};