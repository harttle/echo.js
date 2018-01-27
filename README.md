# echo.js

Echo raw http request, for test usage.

## Example of using echo.js to test HTTP client

Assuming we have the following HTTP client:

```js
const superagent = require('superagent');

function getPizzas() {
    return superagent.get('http://localhost:8061/api/v1/pizzas');
}

function postPizza() {
    return superagent
        .post('http://localhost:8061/api/v1/pizzas')
        .send({ name: 'margherita' })
        .set('X-API-Key', 'foobar');
}

module.exports = {
    getPizzas,
    postPizza,
};
```

We can write something like the following to test how we expect this client's requests to look like:

```js
const assert = require('chai').assert;
const client = require('./client');
const { createServer } = require('echo.js');

const server = createServer();
const port = 8061;

server.listen(port, function() {
    /*
    GET /api/v1/pizzas HTTP/1.1
    Host: localhost:8061
    Accept-Encoding: gzip, deflate
    User-Agent: node-superagent/3.8.2
    Connection: close

    */
    const getPizzasPromise = client.getPizzas().then(res => {
        // add assertions, e.g.
        const lines = res.text.split('\n');

        assert.equal(lines[0], 'GET /api/v1/pizzas HTTP/1.1');
    });

    /*
    POST /api/v1/pizzas HTTP/1.1
    Host: localhost:8061
    Accept-Encoding: gzip, deflate
    User-Agent: node-superagent/3.8.2
    Content-Type: application/json
    X-API-Key: foobar
    Content-Length: 21
    Connection: close

    {"name":"margherita"}
    */
    const postPizzasPromise = client.postPizza().then(res => {
        // add assertions, e.g.
        assert.equal(
            res.text,
            [
                'POST /api/v1/pizzas HTTP/1.1',
                'Host: localhost:8061',
                'Accept-Encoding: gzip, deflate',
                'User-Agent: node-superagent/3.8.2',
                'Content-Type: application/json',
                'X-API-Key: foobar',
                'Content-Length: 21',
                'Connection: close',
                '',
                '{"name":"margherita"}',
            ].join('\n'),
        );
    });

    Promise.all([getPizzasPromise, postPizzasPromise])
        .then(() => {
            console.log('All tests pass');
        })
        .catch(err => {
            console.error(err.message);
        })
        .then(() => {
            server.close();
        });
});
```

The same example can be found in this repo's `test` directory.
