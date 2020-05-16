const { match, pathToRegexp } = require('path-to-regexp');

function getMapping(path) {
  const mappings = [
    {
      path: '/mock/nasa-api/planetary/earth/imagery/:id',
      response: {
        type: 'template',
        body: '{"name": "Lalla"}',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300'
        },
        status: 200
      },
      hang: false,
      throttle: {
        type: 'random',
        min: 120,
        max: 300
      }
    },
    {
      path: '/mock/cern/dataset',
      response: 'random'
    }
  ];
  return mappings.find(mapping => pathToRegexp(mapping.path).test(path));
}

/**
 * Returns a random number between "min" and "max" inclusive.
 * Returns zero if called without parameters.
 *
 * @param {number} min lower limit
 * @param {number} max upper limit
 */
function getRandom(min = 0, max = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getThrottle(throttle) {
  if (throttle) {
    const { type } = throttle;
    if (type === 'set') {
      return throttle.value;
    }

    if (type === 'random') {
      return getRandom(throttle.min, throttle.max);
    }
  }

  return 0;
}

function sendResponse(response, mapping) {
  const { type } = mapping.response;
  if (type === 'template') {
    response.send(mapping.response.body);
  }
}

/**
 * {...mapping, ...match(mapping.path)(request.path)}
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function mock(request, response, next) {
  const mapping = getMapping(request.path);

  if (mapping) {
    const { headers, status } = mapping.response;

    if ( headers ) {
      for (let [key, value] of Object.entries(headers)) {
        response.set(key, value);
      }
    }

    if (status) {
      response.status(status);
    }

    const delay = getThrottle(mapping.throttle);

    if (!mapping.hang) {
      setTimeout(sendResponse, delay, response, mapping);
    }
  }
}

module.exports = mock;
