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
	path: '/mock/nasa-api/planetary/earth/imagery',
	response: {},
	hang: false,
	throttle: {}
}
```

```
response: {
	type: 'template',
	body: '{"name": "Simone"}',
	headers: {
		'Content-Type': 'application/json',
		'Cache-Control': 'public, max-age=300'
	},
	status: 200
},
```

```
response: {
	type: 'proxy',
	baseUrl: 'https://api.nasa.gov',
	headers: {
		'Content-Type': 'application/json',
		'Cache-Control': 'public, max-age=300'
	},
	status: 200
}
```

```
throttle: {
	type: 'random',
	min: 120,
	max: 300
}
```

```
throttle: {
	type: 'set',
	value: 2000
}
```
