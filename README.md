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

## Container
`docker build -t mockery .`

`docker run --detach --name mockery --publish 80:8080 mockery`
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
