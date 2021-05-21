import type { NextApiRequest, NextApiResponse } from 'next'
import { throttle, serialisePath } from 'src/utils';

function getConfig(path) {
  // return {
  //   type: 'fixture',
  //   status: 200,
  //   headers: {
  //     'x-custom-1': 'Custom 1',
  //     'x-custom-2': 2,
  //     'Content-Type': 'text/javascript'
  //   },
  //   body: '{"key": "value"}',
  //   delay: null
  // };

  return {
    type: 'proxy',
    protocol: 'https',
    host: 'api.nasa.gov',
    delay: null
  };
}

async function sendResponse(request, response, config) {
  const { type } = config;

  if (type === 'fixture') {
    response.status(config.status);

    const entries = Object.entries(config.headers);
    for (const [key, value] of entries) {
      response.setHeader(key, value);
    }

    return response.send(config.body);
  }

  if (type === 'proxy') {
    const url = `${config.protocol}://${config.host}${serialisePath(request.query)}`;

    const headers = request.headers;
    headers.host = config.host; // override it with the proxy host value

    const proxyResponse = await fetch(url, {
      headers
    });

    response.status(proxyResponse.status);

    /* Proxy headers can be optional in a future iteration */
    const entries = proxyResponse.headers.entries();
    for (const [key, value] of entries) {
      if (value !== 'gzip') {
        response.setHeader(key, value);
      }
    }

    const content = await proxyResponse.text();

    return response.send(content);
  }
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const config = getConfig(request.query.path);

  if (config) {
    const delay = throttle(config.delay);

    if (delay >= 0) {
      setTimeout(sendResponse, delay, request, response, config);
    }
  } else {
    response.status(404).end();
  }
}
