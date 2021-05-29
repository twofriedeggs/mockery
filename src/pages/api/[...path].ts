import type { NextApiRequest, NextApiResponse } from 'next'
import { pathToRegexp } from 'path-to-regexp';
import { throttle, serialisePath } from 'src/utils';

async function getConfig(query) {
  const path = serialisePath(query, true);

  const configs = [
    {
      path: '/nasa-api/planetary/earth/imagery/:id',
      type: 'fixture',
      status: 200,
      headers: {
        'x-custom-header': 'Custom Header',
        'Content-Type': 'text/javascript'
      },
      body: '{"name": "Nasa Api"}'
    },
    {
      path: '/planetary/apod',
      type: 'proxy',
      protocol: 'https',
      host: 'api.nasa.gov',
      delay: null
    }
  ];

  return configs.find(config => pathToRegexp(config.path).test(path));
}

async function sendResponse(request, response, config) {
  const { type } = config;

  if (type === 'fixture') {
    response.status(config.status);

    const entries = Object.entries(config.headers ?? {});
    for (const [key, value] of entries) {
      response.setHeader(key, value);
    }

    return response.send(config.body);
  }

  if (type === 'proxy') {
    const url = `${config.protocol}://${config.host}${serialisePath(request.query)}`;

    const headers = request.headers;
    // override it with the proxy host value
    // without an failed request is shown instead
    headers.host = config.host;

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
  const config = await getConfig(request.query);

  if (config) {
    const delay = throttle(config.delay);

    if (delay >= 0) {
      setTimeout(sendResponse, delay, request, response, config);
    }
  } else {
    response.status(404).end();
  }
}
