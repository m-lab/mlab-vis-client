/**
 * Middleware to handle resolving actions with promises
 */
export default function clientMiddleware(api) {
  return ({ dispatch, getState }) =>
    next => action => {
      // if the action passed in is a function, evaluate it now and return the result
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      // otherwise check to see if it has a promise in it
      const { promise, types, ...rest } = action;

      // no promise, pass to other middleware
      if (!promise) {
        return next(action);
      }

      // has a promise, so dispatch the REQUEST action
      const [REQUEST, SUCCESS, FAILURE] = types;
      next({ ...rest, type: REQUEST });

      // now make the request and dispatch the SUCCESS or FAILURE actions on completion
      const actionPromise = promise(api);
      actionPromise.then(
        (result) => next({ ...rest, result, type: SUCCESS }),
        (error) => {
          console.warn('Error in promise', error);
          return next({ ...rest, error, type: FAILURE });
        }
      ).catch(error => {
        console.error('MIDDLEWARE ERROR:', error);
        next({ ...rest, error, type: FAILURE });
      });

      return actionPromise;
    };
}
