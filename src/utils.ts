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
 * - 0 if the delay is not set
 * - -1 if the delay is a "timeout"
 * - a random number within a specified range if the delay is random
 * - a set number
 *
 * @param delay the delay object retrieved from the configuration.
 */
export function throttle(delay): number {
  if (delay) {
    const { type } = delay;
    if (type === 'set-delay') {
      return delay.value;
    }

    if (type === 'random-delay') {
      return random(delay.min, delay.max);
    }

    if (type === 'timeout') {
      return -1;
    }
  }

  return 0;
}

export function serialisePath(query, pathOnly = false) {
  const path = `/${query.path.join('/')}`;

  if (pathOnly) {
    return path;
  }

  const params = Object.entries(query).reduce((accumulator, current) => {
    const [key, value] = current;

    if (key !== 'path') {
      if (accumulator.length === 0) {
        accumulator += `?${key}=${value}`;
      } else {
        accumulator += `&${key}=${value}`;
      }
    }

    return accumulator;
  }, '');

  return `${path}${params}`;
}
