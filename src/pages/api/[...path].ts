import type { NextApiRequest, NextApiResponse } from 'next'
import { pathToRegexp } from 'path-to-regexp';
import { throttle, serialisePath } from 'src/utils';

async function getConfig(query) {
  const path = serialisePath(query, true);

  const configs = [
    {
      path: '/v2/experiments/context',
      type: 'fixture',
      status: 200,
      headers: null,
      body: '{"name": "Context API"}'
    },
    {
      path: '/v2/experience/inline/listen/sign-in',
      type: 'fixture',
      status: 200,
      headers: null,
      body: '{"name": "Homepage API"}'
    },
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

function wait(timeout: number) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  })
}

async function sendResponse(request, response, config) {
  const { type } = config;

  response.setHeader('Access-Control-Allow-Origin', '*');

  if (type === 'fixture') {
    response.status(config.status);

    const entries = Object.entries(config.headers ?? {});
    for (const [key, value] of entries) {
      response.setHeader(key, value);
    }

    response.send(config.body);
  } else if (type === 'proxy') {
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

    response.send(content);
  }
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const config = await getConfig(request.query);

  console.log(request.query);

  if (config) {
    const delay = throttle(config.delay);

    if (delay >= 0) {
      await wait(delay);
      sendResponse(request, response, config);
    }
  } else {
    response.status(404).end();
  }
}
