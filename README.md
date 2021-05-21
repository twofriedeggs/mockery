# Mockery
## Docs

* It can send a static template (JSON, HTML)
* It can update the template with a new file type.
* It can create presets
* It can send presets
* It can automate which preset to send based on time, response path, after a certain request count, a hybrid combination of it
* It can throttle the response time
* It can dynamically filter the response and manipulate it
* It can call a response from an predefined upstream by
* It can send custom status, headers
* It supports the following protocols:
  * HTTP/HTTPS
  * RESP (REdis Serialization Protocol) see https://redis.io/topics/protocol
* It supports CORS
## Configuration
```
{
	type: 'proxy',
	protocol: 'https',
	host: 'api.nasa.gov',
	delay: null
};
```

```
{
	type: 'fixture',
	status: 200,
	headers: {
		'x-custom-header': 'Custom Value',
		'Content-Type': 'text/javascript'
	},
	body: '{"key": "value"}',
	delay: null
};
```
## Headers
It's an object containing key/value pairs representing the header to return

```
headers: {
	'Content-Type': 'text/javascript',
	'X-Custom-Header': 'some custom value',
}
```

## Delay
Adds an artificial delay to the response. The delay can be:

A random delay between a set interval
```
delay: {
	type: 'random-delay',
	min: 120,
	max: 300
}
```

A set number
```
delay: {
	type: 'set-delay',
	value: '500'
}
```

A timeout (no response is returned)
```
delay: {
	type: 'timeout'
}
```

## Examples

```ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { id } = request.query;
  let user = '';
  try {
    user = (await import(`fixtures/users/${id}`)).default;
    response.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    response.status(404).json({ error: error.message });
  }
}
```

```ts
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
  if (type === 'fixture') {
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
```
