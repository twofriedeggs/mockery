import Throttle, { RandomDelayThrottle, SetDelayThrottle } from 'src/types/throttle';


/**
 * Returns a pseudo random number between "min" and "max" inclusive.
 * Returns zero if called without parameters.
 *
 * @param min lower limit
 * @param max upper limit
 */
export function random(min: number = 0, max: number = 0): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a number that can be:
 * - 0 if the throttle is null
 * - -1 if the throttle is a "timeout"
 * - a random number within a specified range if the throttle is a "random delay"
 * - a number specified by the "set delay" throttle
 *
 * @param throttle the throttle object retrieved from the configuration.
 */
export function throttle(throttle: Throttle | null): number {
  if (throttle) {
    const { type } = throttle;
    if (type === 'set-delay') {
      return (throttle as SetDelayThrottle).value;
    }

    if (type === 'random-delay') {
      const min = (throttle as RandomDelayThrottle).min;
      const max = (throttle as RandomDelayThrottle).max;
      return random(min, max);
    }

    if (type === 'timeout') {
      return -1;
    }
  }

  return 0;
}

export function serialisePath(object) {
  const o = Object.entries(object).reduce((accumulator, current) => {
    const [key, value] = current;

    if (key === 'path') {
      accumulator.path = `/${value.join('/')}`;
    } else {
      if (accumulator.params.length === 0) {
        accumulator.params += `?${key}=${value}`;
      } else {
        accumulator.params += `&${key}=${value}`;
      }
    }

    return accumulator;
  }, {
    path: '',
    params: ''
  });

  if (o.path) return `${o.path}${o.params}`;

  return '';
}
